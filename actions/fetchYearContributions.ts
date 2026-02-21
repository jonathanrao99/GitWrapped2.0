import { graphQL } from "./graphql";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export async function fetchYearContributions(
  username: string,
  year: number
): Promise<{ date: string; contributionCount: number }[]> {
  try {
    const query = `
      query ($user: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $user) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const startYear = `${year}-01-01T00:00:00Z`;
    const endYear = `${year}-12-31T23:59:59Z`;

    const data = await graphQL({query, variables: {user: username, from: startYear, to: endYear}});
    
    if (!data || !data.user || !data.user.contributionsCollection) {
      console.warn(`No contribution data found for user ${username} in year ${year}`);
      return [];
    }

    const weeks: ContributionWeek[] = data.user.contributionsCollection.contributionCalendar?.weeks ?? [];

    const contributionDays: { date: string; contributionCount: number }[] = [];
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    for (const week of weeks) {
      if (week.contributionDays) {
        for (const day of week.contributionDays) {
          if (day?.date != null && typeof day.contributionCount === 'number') {
            const d = day.date.slice(0, 10);
            if (d >= yearStart && d <= yearEnd) {
              contributionDays.push({ date: d, contributionCount: day.contributionCount });
            }
          }
        }
      }
    }

    return contributionDays;
  } catch (error) {
    console.error(`Error fetching year contributions for ${username} in ${year}:`, error);
    return [];
  }
}
