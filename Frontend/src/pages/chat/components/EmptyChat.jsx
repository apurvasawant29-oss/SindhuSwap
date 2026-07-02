import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white h-full">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-24 h-24 rounded-full bg-emerald-50 blur-xl animate-pulse" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 relative z-10">
          <FiMessageCircle className="h-8 w-8" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800">SindhuSwap Messages</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
        Select a conversation from the sidebar to view swap requests and start chatting.
      </p>
      
      <Link
        to="/categories"
        className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all duration-300 active:scale-98"
      >
        Browse Listings
      </Link>
    </div>
  );
}

export default EmptyChat;
