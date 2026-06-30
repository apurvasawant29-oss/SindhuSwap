import { Link } from "react-router-dom";
import { PiUsersThreeFill } from "react-icons/pi";

function Logo() {
  return (
    <Link className="logo" to="/" aria-label="SindhuSwap home">
      <span className="logo__mark">
        <PiUsersThreeFill />
      </span>
      <span>
        Sindhu<span>Swap</span>
      </span>
    </Link>
  );
}

export default Logo;
