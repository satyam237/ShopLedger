# ShopLedger workshop submission

**Ticket 3.** Checkout now accepts the exact sellable quantity, including the last unit, while rejecting orders above available stock. Cancellation restores physical stock once and preserves wholesale holds. The final test run passed all six tests.

| Checkpoint | Evidence |
| --- | --- |
| CP1 | [Read-only app review](cp1-read-only-app-review.png) |
| CP2 | [Architecture diagram screenshot](cp2-architecture.png) and [original SVG](../architecture.svg) |
| AGENTS.md | [Repository instructions screenshot](agents-md.png) and [complete file](../../AGENTS.md) |
| CP3 | [Five passing characterization tests before the fix](cp3-characterization-tests.png) |
| CP4 | [Failing regression test, passing suite, and app before and after the fix](cp4-inventory-fix.png) |
| CP5 | [Pull request screenshot while it was open](cp5-pull-request.png) and [pull request #1](https://github.com/satyam237/ShopLedger/pull/1) |

The CP1–CP3 evidence records the app before the inventory fix. The CP5 screenshot was taken before the pull request was merged.

[Workshop fork](https://github.com/satyam237/ShopLedger) · [Upstream inventory issue](https://github.com/JayanGupta/ShopLedger/issues/2)
