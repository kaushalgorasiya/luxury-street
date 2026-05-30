export default function Footer() {
  return (
    <footer className="bg-black py-10 border-t border-gray-900">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6">
        <div className="bg-[#666666] text-white rounded-lg p-6 w-full md:w-auto md:min-w-[400px] text-sm">
          <p className="mb-1"><span className="font-semibold">Mobile No:</span> 9274014911</p>
          <p className="mb-1"><span className="font-semibold">Email:</span> luxurystreet2025@gmail.com</p>
          <p className="mb-1"><span className="font-semibold">Address:</span></p>
          <p><span className="font-semibold">Store Time:</span> 11:00 - 8:00, Monday - Saturday</p>
        </div>
        
        <div className="bg-[#666666] text-white rounded-lg p-6 w-full md:w-auto md:min-w-[400px] flex items-center justify-center text-sm h-[116px]">
          <p>Made with <span className="text-red-500">❤️</span> for India</p>
        </div>
      </div>
    </footer>
  );
}
