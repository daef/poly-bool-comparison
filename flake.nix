{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:

      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = with pkgs;
          stdenv.mkDerivation {
            name = "dev-shell";
            version = "1.0.0";
            buildInputs = [
nodejs
nodePackages.npm
graphicsmagick
inkscape
            ];
          };
      });
}
