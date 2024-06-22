/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./utils/customIcon.js",
  ],
  theme: {
    extend: {
      dropShadow: {
        "0md": "0px -0px 1.8px rgba(0, 0, 0, 0.45)",
        "1md": "1px -1px 1.8px rgba(0, 0, 0, 0.4)",
        "2md": "2px -2px 1.8px rgba(0, 0, 0, 0.4)",
        "3md": "3px -3px 1.8px rgba(0, 0, 0, 0.4)",
        "4md": "4px -4px 1.8px rgba(0, 0, 0, 0.4)",
        "5md": "5px -5px 1.8px rgba(0, 0, 0, 0.4)",
        "6md": "6px -6px 1.8px rgba(0, 0, 0, 0.4)",
        "7md": "7px -7px 1.8px rgba(0, 0, 0, 0.4)",
        "8md": "8px -8px 1.8px rgba(0, 0, 0, 0.4)",
        "9md": "9px -9px 1.8px rgba(0, 0, 0, 0.4)",
        "11md": "11px -11px 2px rgba(0, 0, 0, 0.2)",
        "10md": "10px -10px 2px rgba(0, 0, 0, 0.2)",
        "12md": "12px -12px 2px rgba(0, 0, 0, 0.2)",
        "13md": "13px -13px 2px rgba(0, 0, 0, 0.2)",
        "14md": "14px -14px 2px rgba(0, 0, 0, 0.2)",
        "15md": "15px -15px 2px rgba(0, 0, 0, 0.2)",
        "16md": "16px -16px 2px rgba(0, 0, 0, 0.2)",
        "17md": "17px -17px 2px rgba(0, 0, 0, 0.2)",
        "18md": "18px -18px 2px rgba(0, 0, 0, 0.2)",
        "19md": "19px -19px 2px rgba(0, 0, 0, 0.2)",
        "20md": "20px -20px 3px rgba(0, 0, 0, 0.15)",
        "21md": "21px -21px 3px rgba(0, 0, 0, 0.15)",
        "22md": "22px -22px 3px rgba(0, 0, 0, 0.15)",
        "23md": "23px -23px 3px rgba(0, 0, 0, 0.15)",
        "24md": "24px -24px 3px rgba(0, 0, 0, 0.15)",
        "25md": "25px -25px 3px rgba(0, 0, 0, 0.15)",
        "26md": "26px -26px 3px rgba(0, 0, 0, 0.15)",
        "27md": "27px -27px 3px rgba(0, 0, 0, 0.15)",
        "28md": "28px -28px 3px rgba(0, 0, 0, 0.15)",
        "29md": "29px -29px 3px rgba(0, 0, 0, 0.15)",
        "30md": "30px -30px 3.5px rgba(0, 0, 0, 0.18)",
        "31md": "31px -31px 4px rgba(0, 0, 0, 0.18)",
        "32md": "32px -32px 4px rgba(0, 0, 0, 0.18)",
      },
      keyframes: {
        spinFastToFaster: {
          "0%": {
            transform: "rotate(0deg)",
            animationTimingFunction: "ease-in",
          },
          "50%": {
            transform: "rotate(180deg)",
            animationTimingFunction: "linear",
          },
          "100%": {
            transform: "rotate(360deg)",
            animationTimingFunction: "linear",
          },
        },
        spinFaster: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(2160deg)" }, // 2.4 rotations per second
        },
      },
      animation: {
        spinFastToFaster:
          "spinFastToFaster 2s ease-in-out, spinFaster 2s linear 0.4s infinite",
      },
    },
  },
  plugins: [],
};
