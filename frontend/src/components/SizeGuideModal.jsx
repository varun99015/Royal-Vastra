import { X, Ruler } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sizeTable = [
    { size: 'S (38)', chest: '38 in / 96 cm', shoulder: '17.5 in', length: '40 in', sleeve: '24.5 in' },
    { size: 'M (40)', chest: '40 in / 101 cm', shoulder: '18.0 in', length: '41 in', sleeve: '25.0 in' },
    { size: 'L (42)', chest: '42 in / 106 cm', shoulder: '18.5 in', length: '42 in', sleeve: '25.5 in' },
    { size: 'XL (44)', chest: '44 in / 111 cm', shoulder: '19.0 in', length: '43 in', sleeve: '26.0 in' },
    { size: 'XXL (46)', chest: '46 in / 116 cm', shoulder: '19.5 in', length: '44 in', sleeve: '26.5 in' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white max-w-xl w-full border border-beige/60 shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-beige/40 flex items-center justify-between bg-ivory">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gold-dark" />
            <h3 className="font-display font-bold text-lg text-charcoal">
              Men's Ethnic Wear Size Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-charcoal/60 hover:text-charcoal hover:bg-beige/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-xs text-charcoal/70 mb-4 leading-relaxed">
            Our ethnic kurtas and sherwanis are tailored to standard Indian comfort fits. For layering or wedding sherwanis with structured chest canvassing, choose your standard suit chest size.
          </p>

          <div className="overflow-x-auto border border-beige/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-charcoal text-white font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 border-r border-charcoal-soft">Size</th>
                  <th className="py-2.5 px-3 border-r border-charcoal-soft">To Fit Chest</th>
                  <th className="py-2.5 px-3 border-r border-charcoal-soft">Shoulder</th>
                  <th className="py-2.5 px-3 border-r border-charcoal-soft">Length</th>
                  <th className="py-2.5 px-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/30">
                {sizeTable.map((row) => (
                  <tr key={row.size} className="hover:bg-ivory/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-burgundy">{row.size}</td>
                    <td className="py-2.5 px-3 text-charcoal/80">{row.chest}</td>
                    <td className="py-2.5 px-3 text-charcoal/70">{row.shoulder}</td>
                    <td className="py-2.5 px-3 text-charcoal/70">{row.length}</td>
                    <td className="py-2.5 px-3 text-charcoal/70">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-3.5 bg-beige/20 border-l-2 border-gold text-[11px] text-charcoal/80 space-y-1">
            <p>
              <strong>Need a bespoke recommendation?</strong>
            </p>
            <p>
              Send your height, weight, and chest measurement to our WhatsApp master tailor for personalized sizing advice.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-beige/40 bg-ivory/50 flex justify-end">
          <button type="button" onClick={onClose} className="btn-primary py-2 text-xs">
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
