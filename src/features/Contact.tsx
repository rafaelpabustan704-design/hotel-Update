import { CONTACT_INFO } from '@/constants/hotel';

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 py-24 bg-hotel-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400 mb-3">
            Get In Touch
          </p>
          <h2 className="font-serif text-4xl font-bold mb-4">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-hotel-300 leading-relaxed">
            Have a question or need assistance with your booking? Our team is here to help make your
            experience exceptional.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_INFO.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-600/20 text-gold-400">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="text-sm text-hotel-300 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
