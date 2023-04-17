import { rocketconnect } from "../images";
import { Container } from "./Container";

export function Supported() {
  return (
    <div className="bg-white">
      <Container>
        <div className="flex justify-between">
          <div>
            <h3>Supported</h3>
            <div className="w-16">
              <img src={rocketconnect} alt="rocketconnect" />
            </div>
          </div>
          <div>
            <h3>Supported</h3>
            <div className="w-16">
              <img src={rocketconnect} alt="rocketconnect" />
            </div>
          </div>
          <div>
            <h3>Supported</h3>
            <div className="w-16">
              <img src={rocketconnect} alt="rocketconnect" />
            </div>
          </div>
          <div>
            <h3>Supported</h3>
            <div className="w-16">
              <img src={rocketconnect} alt="rocketconnect" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
