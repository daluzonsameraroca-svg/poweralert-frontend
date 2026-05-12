import logo from "../../assets/logo.png";

export default function Logo({ size = "md", showText = true, subtitle }) {
  return (
    <div className={`app-logo app-logo-${size}`}>
      <img src={logo} alt="ElectroPulse Logo" />

      {showText && (
        <div>
          <h2>ElectroPulse</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
    </div>
  );
}