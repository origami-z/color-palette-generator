import { useTheme } from "@jpmorganchase/uitk-core";
import GHLogo from "./GitHub-Mark-64px.png";
import GHLightLogo from "./GitHub-Mark-Light-64px.png";

export const GitHubLink = () => {
  const [currentTheme] = useTheme();
  console.log(currentTheme);
  return (
    <div className="GitHubLink">
      <a
        href="https://github.com/origami-z/color-palette-generator"
        target="_blank"
      >
        <img
          alt="GitHub Logo"
          src={currentTheme.name === "light" ? GHLogo : GHLightLogo}
          width={32}
        />
      </a>
    </div>
  );
};
