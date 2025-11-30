## Getting Started

First, run the development server:

```bash
pnpm dev
```

## forward port for android

```shell
adb devices
```

that should output something like this

```text
List of devices attached
emulator-5554   device
```

and than run

```shell
adb -s emulator-5554 reverse tcp:3333 tcp:3333
```
