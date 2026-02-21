export interface GraphQLVariables {
  username?: string;
  user?: string;
  from?: string;
  to?: string;
  [key: string]: unknown;
}

export const graphQL = async ({ query, variables }: {
  query: string;
  variables: GraphQLVariables;
}) => {
  try {
    const token = process.env.GITHUB_TOKEN ?? process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        
    if (!token) {
      throw new Error('GitHub token not found. Please set GITHUB_TOKEN or NEXT_PUBLIC_GITHUB_TOKEN in .env.local');
    }

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API Error: ${response.status} - ${errorText}`);
      throw new Error(`GitHub API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const errors = data.errors as Array<{ message: string }> | undefined;
    if (errors?.length) {
      console.error('GraphQL Errors:', errors);
      throw new Error(`GraphQL errors: ${errors.map((e) => e.message).join(', ')}`);
    }

    return data.data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
};