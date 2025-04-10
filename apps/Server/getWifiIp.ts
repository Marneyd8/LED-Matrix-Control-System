import { exec } from 'child_process';

// Function to get the Wi-Fi IP address from 'ipconfig' output
export function getWiFiIpAddress(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('ipconfig', (error, stdout, stderr) => {
      if (error || stderr) {
        reject(`Error: ${error || stderr}`);
        return;
      }

      // Regex to extract IPv4 address for the Wi-Fi adapter
      const regex = /Wireless LAN adapter Wi-Fi[\s\S]+?IPv4 Address[^\d]*(\d+\.\d+\.\d+\.\d+)/;
      const match = regex.exec(stdout);

      if (match && match[1]) {
        resolve(match[1]);
      } else {
        reject('Wi-Fi IP address not found.');
      }
    });
  });
}
