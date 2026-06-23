import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#facebook' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'YouTube', icon: Youtube, href: '#youtube' },
    { name: 'Twitter/X', icon: Twitter, href: '#twitter' },
  ];

  return (
    <footer 
      className="bg-[#F5F5F5] border-t border-[#E5E5E5] py-12 px-6 md:px-12 w-full text-left"
      id="component-footer"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {/* Block 1: Brand & Slogan */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 bg-[#222222] text-white flex items-center justify-center font-display font-extrabold text-sm rounded-sm">
              PA
            </div> */}
            <span className="font-display font-black text-lg tracking-tight text-[#222222] uppercase">
              PASS AFRICA
            </span>
          </div>
          <p className="font-display font-extrabold text-xs text-blue-600 uppercase tracking-widest leading-none">
            "Culture Tradition • Innovation"
          </p>
          <p className="font-sans text-xs text-gray-500 max-w-xs mt-1">
            Revaloriser notre patrimoine culturel millénaire à travers des solutions numériques audacieuses et accessibles.
          </p>
        </div>

        {/* Block 2: Short 2-line Description */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-gray-400">
            Le Projet
          </h4>
          <p className="font-sans text-xs text-gray-600 leading-relaxed max-w-sm">
            La plateforme "PASS EVALA 2026" est une initiative de PASS AFRICA pour digitaliser l'accès aux guides touristiques et aux actualités lors des fêtes traditionnelles Evala dans la Kozah.
          </p>
        </div>

        {/* Block 3: Social Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-gray-400">
            Nous Suivre
          </h4>
          <div className="flex gap-2.5 mt-1">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulation : Redirection vers la page ${social.name} de PASS AFRICA`);
                  }}
                  className="p-2.5 bg-white border border-[#E5E5E5] hover:border-[#222222] text-gray-600 hover:text-[#222222] rounded-sm transition-all duration-200 shadow-xs"
                  title={social.name}
                  id={`footer-social-${social.name.toLowerCase().replace('/', '-')}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
          <span className="text-[10px] text-gray-400 font-sans tracking-tight mt-1 block">
            Flux taggé officiel: <span className="font-mono text-gray-600">#PassEvala2026</span>
          </span>
        </div>

        {/* Block 4: Contact Info */}
        <div className="flex flex-col gap-3 text-xs">
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-gray-400">
            Contacts & Aide
          </h4>
          
          <ul className="flex flex-col gap-2.5 text-gray-600">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <a href="mailto:contact@pass-africa.com" className="hover:text-blue-600 transition-colors">
                contact@pass-africa.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <a href="tel:+22822214313" className="hover:text-blue-600 transition-colors font-mono">
                +228 22 21 43 13 (Lomé / TG)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">
                Boulevard de la Kara, BP 451, Kara, Togo
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy Policy footer row */}
      <div className="max-w-7xl mx-auto border-t border-[#E5E5E5] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
        <p className="font-sans">
          &copy; {currentYear} PASS AFRICA. Tous droits réservés. Plateforme conçue pour les initiations traditionnelles Evala du canton de la Kozah.
        </p>
        <span className="flex items-center gap-1 font-sans">
          Fait avec <Heart className="w-3 h-3 text-red-600 fill-current animate-pulse" /> pour la valorisation du patrimoine togolais.
        </span>
      </div>
    </footer>
  );
}
