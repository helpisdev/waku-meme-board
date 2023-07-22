/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		colors: {
			"transparent": "transparent",
			"current": "currentColor",
			"app": {
				light: "#fdfdfc",
				DEFAULT: "#fdfdfc",
				dark: "#161615",
			},
			"subtle": {
				light: "#fcf9f6",
				DEFAULT: "#fcf9f6",
				dark: "#221813",
			},
			"ui-el": {
				light: "#e7f9fb",
				DEFAULT: "#e7f9fb",
				dark: "#072830",
			},
			"hovered-ui-el": {
				light: "#d8f3f6",
				DEFAULT: "#d8f3f6",
				dark: "#07303b",
			},
			"active-ui-el": {
				light: "#c4eaef",
				DEFAULT: "#c4eaef",
				dark: "#073844",
			},
			"subtle-borders-and-seperators": {
				light: "#aadee6",
				DEFAULT: "#aadee6",
				dark: "#064150",
			},
			"ui-el-borders-and-focus-rings": {
				light: "#84cdda",
				DEFAULT: "#84cdda",
				dark: "#045063",
			},
			"hovered-ui-el-border": {
				light: "#3db9cf",
				DEFAULT: "#3db9cf",
				dark: "#00647d",
			},
			"solid": {
				light: "#e54d2e",
				DEFAULT: "#e54d2e",
				dark: "#e54d2e",
			},
			"hovered-solid": {
				light: "#db4324",
				DEFAULT: "#db4324",
				dark: "#ec5e41",
			},
			"low-contrast": {
				light: "#0c7792",
				DEFAULT: "#0c7792",
				dark: "#00c2d7",
			},
			"high-contrast": {
				light: "#1b1b18",
				DEFAULT: "#1b1b18",
				dark: "#ededec",
			},
		},
		extend: {},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/container-queries"),
		require("@tailwindcss/forms"),
	],
};
