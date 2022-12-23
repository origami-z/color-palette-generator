import { useTheme } from "@salt-ds/core";
import GHLogo from "./GitHub-Mark-64px.png";
import GHLightLogo from "./GitHub-Mark-Light-64px.png";

export const GitHubLink = () => {
  const { mode } = useTheme();

  return (
    <div className="GitHubLink">
      <a
        href="https://github.com/origami-z/color-palette-generator"
        target="_blank"
      >
        <img
          alt="GitHub Logo"
          src={mode === "light" ? GHLogo : GHLightLogo}
          width={32}
        />
      </a>
    </div>
  );
};
