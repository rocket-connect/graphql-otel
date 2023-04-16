module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ["graphql-otel-dark"]: "#221F20",
        ["graphql-otel-green"]: "#2F8525",
      },
    },
  },
  plugins: [],
};
