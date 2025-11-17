// Fuzzy scoring logic adapted from cmdk's command scoring implementation.
const SCORE_CONTINUE_MATCH = 1;
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
const SCORE_CHARACTER_JUMP = 0.17;
const SCORE_TRANSPOSITION = 0.1;
const PENALTY_SKIPPED = 0.999;
const PENALTY_CASE_MISMATCH = 0.9999;
const PENALTY_NOT_COMPLETE = 0.99;

const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;

function commandScoreInner(
  str: string,
  abbreviation: string,
  lowerStr: string,
  lowerAbbreviation: string,
  strIndex: number,
  abbreviationIndex: number,
  memoizedResults: Record<string, number>
): number {
  if (abbreviationIndex === abbreviation.length) {
    if (strIndex === str.length) {
      return SCORE_CONTINUE_MATCH;
    }
    return PENALTY_NOT_COMPLETE;
  }

  const memoizeKey = `${strIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== undefined) {
    return memoizedResults[memoizeKey];
  }

  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerStr.indexOf(abbreviationChar, strIndex);
  let highScore = 0;

  while (index >= 0) {
    let score = commandScoreInner(
      str,
      abbreviation,
      lowerStr,
      lowerAbbreviation,
      index + 1,
      abbreviationIndex + 1,
      memoizedResults
    );

    if (score > highScore) {
      if (index === strIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(str.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        const wordBreaks = str.slice(strIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && strIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, wordBreaks.length);
        }
      } else if (IS_SPACE_REGEXP.test(str.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        const spaceBreaks = str.slice(strIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && strIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, spaceBreaks.length);
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (strIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, index - strIndex);
        }
      }

      if (str.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }

    const nextAbbreviationChar = lowerAbbreviation.charAt(abbreviationIndex + 1);
    const prevLowerChar = lowerStr.charAt(index - 1);
    const currentLowerChar = lowerAbbreviation.charAt(abbreviationIndex);

    if (
      (score < SCORE_TRANSPOSITION && prevLowerChar === nextAbbreviationChar) ||
      (nextAbbreviationChar === currentLowerChar && prevLowerChar !== currentLowerChar)
    ) {
      const transposedScore = commandScoreInner(
        str,
        abbreviation,
        lowerStr,
        lowerAbbreviation,
        index + 1,
        abbreviationIndex + 2,
        memoizedResults
      );

      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }

    if (score > highScore) {
      highScore = score;
    }

    index = lowerStr.indexOf(abbreviationChar, index + 1);
  }

  memoizedResults[memoizeKey] = highScore;
  return highScore;
}

function formatInput(str: string) {
  return str.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}

export function commandScore(string: string, abbreviation: string, aliases: string[] = []) {
  const enriched = aliases.length ? `${string} ${aliases.join(" ")}` : string;
  return commandScoreInner(
    enriched,
    abbreviation,
    formatInput(enriched),
    formatInput(abbreviation),
    0,
    0,
    {}
  );
}
