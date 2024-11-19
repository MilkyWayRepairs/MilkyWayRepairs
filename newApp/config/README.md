Create a config.ts file, then paste this into it and replace IP_ADDRESS with your ip address

export const SERVER_URL: string = 'http://YOUR_LOCAL_IP_ADDRESS:5000';

If you are on a mac AND using Android Studio Emulator, use 10.0.2.2 instead of YOUR_LOCAL_IP_ADDRESS inside config.ts
AND
5001 instead of 5000 for both config.ts and main.py