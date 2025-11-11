"use client";

import { X } from "lucide-react";
import { useState } from "react";

export const DevNotice = () => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div
            className="
        fixed bottom-6 right-6 z-50
        flex items-start gap-3
        bg-yellow-100 dark:bg-yellow-900
        text-yellow-900 dark:text-yellow-100
        border border-yellow-300 dark:border-yellow-700
        rounded-xl shadow-md
        p-3 w-[320px]
        animate-in slide-in-from-bottom duration-300
      "
        >
            <div className="flex-1 text-[12px] leading-snug">
                <p className="font-semibold mb-1 text-[13px]">🚧 Project in Development</p>
                <p className="opacity-90">
                    This project is still being built — expect bugs or missing features.{" "}
                    Hit{" "}
                    <span
                        className="
                        inline-block px-2 py-[1px] text-[11px] font-medium
                        rounded
                        border border-current
                      "
                    >
                        Sign up
                    </span>{" "}
                    to join the waitlist and get early access.
                </p>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="p-1 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-md transition"
            >
                <X size={14} />
            </button>
        </div>
    );
};
