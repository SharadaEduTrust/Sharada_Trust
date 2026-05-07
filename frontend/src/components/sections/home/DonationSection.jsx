import React from "react";
import { Heart, Star } from "lucide-react";
import qrCodeImage from "../../../assets/QR.webp";

import { API_BASE_URL } from "../../../utils/constants";

export default function DonationSection({ data }) {
  // Fallbacks
  const title = data?.title || "Together Let's Change The World";
  const quote = data?.quote || "Donating for an Educational cause is an extremely noble act since the impact lasts a lifetime";
  const listTitle = data?.listTitle || "Donate now";
  const points = (data?.points && data.points.length > 0) ? data.points : [
    "Sharada Educational Trust is registered as a Public Charitable Trust.",
    "The Trust is registered for undertaking CSR activities.",
    "Donations are eligible for exemption u/s 80G of Income Tax Act 1961."
  ];
  const note = data?.note || "After transfer, please email details (Name, PAN, Address) to info@sharadatrust.org or WhatsApp +91 9019911804.";
  const upiId = data?.upiId || "sharadaeducationaltrust.ibz@icici";
  const image = data?.image ? `${API_BASE_URL}/${data.image}` : qrCodeImage;

  const qrImage = image || "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://sharadaeducationaltrust.org";

  return (
    <div id="donation" className="w-full px-4 py-6 md:py-8 bg-[#F3F4F6]">
      {/* Changed max-w-6xl to max-w-7xl for wider layout */}
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - QR Code AND Note */}
            <div className="bg-white p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
              {/* QR Image */}
              <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-6">
                <img
                  src={qrImage}
                  alt="Donation QR Code"
                  className="w-full h-auto max-w-[200px] sm:max-w-[220px]"
                />
              </div>

              {/* Note Section */}
              <div className="text-center text-[#0B0B45] w-full max-w-sm">
                <p className="font-bold text-sm mb-2 border-b border-gray-200 pb-1 inline-block">
                  Note:
                </p>
                <p className="leading-snug text-xs sm:text-sm mb-2">
                  UPI Id:{" "}
                  <span className="font-bold select-all bg-gray-50 px-1 rounded">
                    {upiId}
                  </span>
                </p>
                <div 
                  className="leading-snug text-xs text-gray-600 prose-sm"
                  dangerouslySetInnerHTML={{ __html: note }}
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="p-6 md:p-10 flex flex-col justify-center text-[#0B0B45] bg-[#F9E2D0]">
              {/* Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 fill-current text-[#0B0B45]" />
                  <span className="font-semibold text-base uppercase tracking-wide">
                    Donate now
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-[#0B0B45]">
                  {title}
                </h2>

                <div className="space-y-3 text-sm md:text-base text-[#0B0B45]">
                  <p className="italic leading-snug opacity-90">
                    "{quote}".
                  </p>
                  <p className="font-bold text-sm">
                    {listTitle}
                  </p>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-3 text-[#0B0B45]">
                {points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Star className="w-4 h-4 fill-current shrink-0 mt-0.5" />
                    <p className="leading-snug text-xs sm:text-sm">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
