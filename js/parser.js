/*
====================================
 CrewMatch Parser v1
====================================
Lee archivos .ICS y devuelve eventos
en un formato estándar.
*/

class CrewParser {

  static parseICS(text) {

    text = text
      .replace(/\r\n[ \t]/g, "")
      .replace(/\n[ \t]/g, "");

    const events = [];

    const matches = [...text.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g)];

    for (const match of matches) {

      const block = match[1];

      const summary = this.get(block, "SUMMARY");
      const start = this.parseDate(this.get(block, "DTSTART"));
      const end = this.parseDate(this.get(block, "DTEND"));

      events.push({
        summary,
        start,
        end,
        type: this.detectType(summary)
      });

    }

    return events;

  }

  static get(block, key) {

    const m = block.match(new RegExp(key + "(?:;[^:]*)?:(.*)"));

    return m ? m[1].trim() : "";

  }

  static parseDate(value) {

    if (!value) return null;

    value = value.replace("Z", "");

    if (value.length === 8) {

      return new Date(
        Number(value.slice(0,4)),
        Number(value.slice(4,6))-1,
        Number(value.slice(6,8))
      );

    }

    return new Date(
      Number(value.slice(0,4)),
      Number(value.slice(4,6))-1,
      Number(value.slice(6,8)),
      Number(value.slice(9,11)),
      Number(value.slice(11,13))
    );

  }

  static detectType(summary) {

    if (!summary) return "OTHER";

    if (
      summary.startsWith("DO") ||
      summary.startsWith("DR")
    ) {
      return "OFF";
    }

    if (
      summary.startsWith("Report time") ||
      summary.startsWith("HSB") ||
      summary.startsWith("B ")
    ) {
      return "FLIGHT";
    }

    if (
      summary.includes("VAC") ||
      summary.includes("VACATION")
    ) {
      return "VACATION";
    }

    return "OTHER";

  }

}
