import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-2HMPS2XTKL'); // sandbox google analytics
//   ReactGA.initialize('G-F02R1V6275'); // Live google analytics
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
