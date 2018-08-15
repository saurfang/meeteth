import memoize from "fast-memoize";
import random from "random";
import seedrandom from "seedrandom";

export function memoizedTokenOfOwnerByIndex(contractMethod) {
  return memoize((id, balance) =>
    Array.from(Array(balance).keys()).map(i => contractMethod.cacheCall(id, i))
  );
}

export function memoizedTokenByIndex(contractMethod) {
  return memoize(ids => ids.map(id => contractMethod.cacheCall(id)));
}

export const drawIds = memoize((max, length, seed) => {
  random.use(seedrandom(seed));

  const reservoir = Array.from(Array(Math.min(max + 1, length)).keys());
  for (let i = reservoir.length; i <= max; i += 1) {
    const j = random.int(0, i);
    if (j < length) {
      reservoir[j] = i;
    }
  }
  return reservoir;
});

export function getAllTokensByIndex(cachedKeys, tokenByIndexFunc) {
  if (cachedKeys) {
    return cachedKeys.map(key => {
      if (key) {
        const result = tokenByIndexFunc[key];
        if (result && !Object.prototype.hasOwnProperty.call(result, "error")) {
          return result.value;
        }
      }
      return null;
    });
  }
  return [];
}

export function unboxNumeric(boxedNumeric) {
  return (
    (boxedNumeric &&
      !Object.prototype.hasOwnProperty.call(boxedNumeric, "error") &&
      +boxedNumeric.value) ||
    0
  );
}
