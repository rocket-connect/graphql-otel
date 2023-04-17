import { Header } from "./components/Header";
import { Intro } from "./components/Intro";
import { Supported } from "./components/Supported";

function App() {
  return (
    <div className="bg-graphql-otel-dark gradient-background">
      <Header />
      <Intro />
      <Supported />
    </div>
  );
}
export default App;
