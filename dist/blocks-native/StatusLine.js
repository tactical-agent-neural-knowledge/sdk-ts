import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { FRESH_FADE_MS } from "../client/fresh.js";
import { Mark } from "./Mark.js";
/**
 * Neural's one-word status line on the phone: TANK's own working mark (the shield with the
 * chevron), gently breathing, beside one word from `STATUS_WORDS`. A new word fades in softly.
 * With `reducedMotion` the mark is still and the word simply changes; the app passes its own
 * Reduce Motion reading, which is also what keeps an animation loop out of a test run.
 * Renders nothing for an empty word.
 */
export function StatusLine({ word, reducedMotion = false, textStyle, testID = "status-line", }) {
    const breath = useRef(new Animated.Value(1)).current;
    const fade = useRef(new Animated.Value(1)).current;
    const showing = word !== "";
    useEffect(() => {
        if (!showing || reducedMotion) {
            breath.setValue(1);
            return;
        }
        const loop = Animated.loop(Animated.sequence([
            Animated.timing(breath, {
                toValue: 0.55,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(breath, {
                toValue: 1,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]));
        loop.start();
        return () => loop.stop();
    }, [showing, reducedMotion, breath]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: the fade restarts when the word changes
    useEffect(() => {
        if (!showing || reducedMotion) {
            fade.setValue(1);
            return;
        }
        fade.setValue(0);
        const run = Animated.timing(fade, {
            toValue: 1,
            duration: FRESH_FADE_MS,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        });
        run.start();
        return () => run.stop();
    }, [word, showing, reducedMotion, fade]);
    if (!showing)
        return null;
    return (_jsxs(View, { style: styles.root, accessibilityRole: "text", accessibilityLiveRegion: "polite", testID: testID, children: [_jsx(Animated.View, { style: { opacity: breath }, children: _jsx(Mark, { kind: "doing", size: 16 }) }), _jsx(Animated.Text, { style: [styles.word, textStyle, { opacity: fade }], numberOfLines: 1, children: word })] }));
}
const styles = StyleSheet.create({
    root: { flexDirection: "row", alignItems: "center", gap: 6, minWidth: 0 },
    word: { fontSize: 12, lineHeight: 18, flexShrink: 1 },
});
