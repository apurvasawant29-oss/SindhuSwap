import { FiMessageCircle } from "react-icons/fi";

function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-700/10">
        <FiMessageCircle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Select a conversation to start chatting.</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Open a buyer or swap request from the list to view messages, product details, and quick replies.
      </p>
    </div>
  );
}

export default EmptyChat;
