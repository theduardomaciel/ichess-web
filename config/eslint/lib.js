/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ["@theduardomaciel/eslint-config/react"],
	plugins: [],
	rules: {
		camelcase: "off",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				args: "all",
				argsIgnorePattern: "^_",
				caughtErrors: "all",
				caughtErrorsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				ignoreRestSiblings: true,
			},
		],
	},
};
