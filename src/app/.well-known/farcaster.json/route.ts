export async function GET() {
  const appUrl = "https://my-frames-v2-demo.vercel.app";

  const config = {
    accountAssociation: {
      header: 'eyJmaWQiOjk4MDIsInR5cGUiOiJjdXN0b2R5Iiwic2lnbmVyIjoiMHhiRmJiZURkOTc3YTA1NUI4NTUwZkUzNTMzMTA2OWNhQkQ4YTRCMjY1In0',
      payload: 'eyJkb21haW4iOiJodHRwczovL215LWZyYW1lcy12Mi1kZW1vLnZlcmNlbC5hcHAvIn0',
      signature: 'IjB4MzlkNjZiYjNiZmUzZTJkN2VlNTI0OWNkYjBjYzk4OTFmNTg1ZTkwMDM3OTcyNWI3NTgyZGIxZTk4ZTQxMjVkMzIxMTI0YTE5YTUzNGNmYzU3YWM2MjczMTBkN2IxMzJhYmUwMWM1ODdiMzlhNDg4MDE0OTE0YjQwNDVkZDU5MjgxYiI',
    },
    frame: {
      version: "0.0.0",
      name: "Frames v2 Onramp",
      iconUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      homeUrl: appUrl,
    },
  };

  return Response.json(config);
}
