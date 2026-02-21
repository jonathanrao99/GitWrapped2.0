import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { ALLOWED_BACKGROUNDS } from '@/constants/backgrounds';

export const POST = async (req: NextRequest) => {
  try {
    const { foregroundPath, backgroundPath } = await req.json();

    if (typeof backgroundPath !== 'string' || !ALLOWED_BACKGROUNDS.includes(backgroundPath)) {
      return NextResponse.json({ error: 'Invalid background' }, { status: 400 });
    }

    const resolvedBackgroundPath = path.join(process.cwd(), 'public', backgroundPath);

    const foregroundBuffer = Buffer.from(foregroundPath, 'base64');
    const foreground = sharp(foregroundBuffer);
    const { width, height } = await foreground.metadata();
    const padding = 50;
    const paddedForeground = await foreground
      .extend({
        top: 0,
        bottom: 0,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    const background = sharp(resolvedBackgroundPath);
    const resizedBackground = await background.resize((width ?? 0) + 2 * padding, height ?? 0).toBuffer();
    const processedImageBuffer = await sharp(resizedBackground)
      .composite([{ input: paddedForeground, blend: 'over' }])
      .toBuffer();

    const uniqueName = `gitwrapped-${crypto.randomUUID()}.png`;

    return new NextResponse(processedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename=${uniqueName}`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
};
