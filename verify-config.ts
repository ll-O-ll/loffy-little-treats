import { getPresaleConfig, updatePresaleConfig } from "./lib/presale-config.ts";

async function verify() {
    const initial = await getPresaleConfig();
    console.log("Initial Occasion:", initial.occasion);

    const updated = { ...initial, occasion: "Eid Al-Adha 2026 TEST" };
    await updatePresaleConfig(updated);

    const final = await getPresaleConfig();
    console.log("Final Occasion:", final.occasion);

    if (final.occasion === "Eid Al-Adha 2026 TEST") {
        console.log("VERIFICATION SUCCESSFUL: Persistence works.");
    } else {
        console.log("VERIFICATION FAILED: Persistence check failed.");
    }

    // Reset
    await updatePresaleConfig(initial);
}

verify();
