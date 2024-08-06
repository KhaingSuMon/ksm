const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d?)$/;

const ipv6Regex =
  /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|((?:[a-fA-F0-9]{1,4}:){1,7}|:):((?:[a-fA-F0-9]{1,4}:){1,6}|:)|((?:[a-fA-F0-9]{1,4}:){1,6}|:):((?:[a-fA-F0-9]{1,4}:){1,5}|:)|((?:[a-fA-F0-9]{1,4}:){1,5}|:):((?:[a-fA-F0-9]{1,4}:){1,4}|:)|((?:[a-fA-F0-9]{1,4}:){1,4}|:):((?:[a-fA-F0-9]{1,4}:){1,3}|:)|((?:[a-fA-F0-9]{1,4}:){1,3}|:):((?:[a-fA-F0-9]{1,4}:){1,2}|:)|((?:[a-fA-F0-9]{1,4}:){1,2}|:):[a-fA-F0-9]{1,4}|((?:[a-fA-F0-9]{1,4}:){1,1}|:):|(?:[a-fA-F0-9]{1,4}:){1,7}:$/i;

export const isValidIPv4 = (ip: string) => ipv4Regex.test(ip);

export const isValidIPv6 = (ip: string) => ipv6Regex.test(ip);

export const getIPCountry = async (ip: string) => {
  try {
    const isIpvalid = isValidIPv4(ip) || isValidIPv6(ip);
    if (!isIpvalid) return "";

    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (data.status === "success") {
      return data.country as string;
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
};

export const formatNumber = (num: number) => {
  if (num < 1000) return num + "";
  else if (num < 1000000) return (num / 1000).toFixed(1) + "k";
  else if (num < 1000000000) return (num / 1000000).toFixed(1) + "m";
  else return (num / 1000000000).toFixed(1) + "b";
};
