rm -r ./node_modules/@keypom/one-click-connect/
mkdir ./node_modules/@keypom/one-click-connect/
cp -r ../keypom-js/packages/one-click-connect/lib/* ./node_modules/@keypom/one-click-connect/
yarn
yarn dev
