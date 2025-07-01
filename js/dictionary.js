// ODS9 Dictionary Loader
const dictionaryCache = {};
export async function isWordValid(word) {
    const length = word.length;
    if (length < 2 || length > 21) return false;
    const fileName = `ODS9/mots${length}lettres.txt`;
    if (!dictionaryCache[length]) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) return false;
            const text = await response.text();
            dictionaryCache[length] = new Set(
                text.split('\n').map(w => w.trim().toUpperCase()).filter(Boolean)
            );
        } catch (e) {
            return false;
        }
    }
    return dictionaryCache[length].has(word.toUpperCase());
}
