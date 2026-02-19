import { useTheme } from '../../context/ThemeContext';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

function Footer() {
  const { darkMode } = useTheme();

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/-rohit-khandelwal-/',
      icon: FaLinkedin,
      color: 'hover:text-blue-500'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/rohit-2059',
      icon: FaGithub,
      color: 'hover:text-gray-600'
    },
    {
      name: 'Portfolio',
      url: 'https://rohitkhandelwal.me',
      icon: FaGlobe,
      color: 'hover:text-purple-500'
    }
  ];

  return (
    <footer
      className={`border-t ${
        darkMode ? 'bg-[#0c0c14] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p
            className={`text-sm ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            © {new Date().getFullYear()} FinTrack. Built by Rohit
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-200 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                } ${link.color}`}
                aria-label={link.name}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
