export const metadata = { title: 'OpenCarBox', description: 'Platform' };
export default function RootLayout({ children }) {
  const React = require('react');
  return React.createElement('html', { lang: 'en' }, React.createElement('body', null, children));
}