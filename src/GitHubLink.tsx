import GHLogo from "./GitHub-Mark-64px.png";

export const GitHubLink = () => {
  return (
    <div className="GitHubLink">
      <a
        href="https://github.com/origami-z/color-palette-generator"
        target="_blank"
      >
        <img alt="GitHub Logo" src={GHLogo} width={32} />
      </a>
    </div>
  );
};
