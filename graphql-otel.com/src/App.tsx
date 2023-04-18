import { Footer } from "./components/Footer";
import { GettingStarted } from "./components/GettingStarted";
import { Header } from "./components/Header";
import { Intro } from "./components/Intro";
import { Supported } from "./components/Supported";

function App() {
  return (
    <div className="bg-graphql-otel-dark gradient-background overflow-hidden">
      <Header />
      <Intro />
      <Supported />
      <GettingStarted />
      <Footer />
    </div>
  );
}
export default App;
