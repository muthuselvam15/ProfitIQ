# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Razorpay subscriptions

Create monthly Razorpay plans for Pro at INR 399 and Premium at INR 799. ProfitIQ verifies the configured plan amount and monthly cadence, and creates subscriptions for 12 billing cycles.

Set the following values in `backend/.env`. Keep the key secret and webhook secret on the backend only:

```dotenv
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_PRO_PLAN_ID=plan_your_pro_plan_id
RAZORPAY_PREMIUM_PLAN_ID=plan_your_premium_plan_id
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

Configure a Razorpay webhook to send `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.completed`, and `subscription.halted` events to `/api/subscription/webhook`. Test with Razorpay test credentials and test plans first. Checkout returns `503` until the keys and plan IDs are configured.
