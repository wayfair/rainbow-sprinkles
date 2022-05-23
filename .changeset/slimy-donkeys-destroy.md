---
'rainbow-sprinkles': patch
---

- Prevents scale values that do not have a `$` prefix from evaluating to scale values.
- Fixes the case where a configured CSS property had a defined scale for staticProperties, and allowed arbitrary values through dynamicProperties, and the incorrect classes were being generated
