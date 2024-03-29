<template>
  <div class="app">
    <sns-bar />
    <div class="main-content">
      <rules-settings
        ref="settings"
        v-model:rules="rules"
        class="rules-settings"
      />
      <div class="editor-content">
        <pg-editor
          v-model="code"
          :rules="rules"
          class="eslint-playground"
          @change="onChange"
        />
        <div class="messages">
          <ol>
            <li
              v-for="(msg, i) in messages"
              :key="msg.line + ':' + msg.column + ':' + msg.ruleId + '@' + i"
              class="message"
              :class="getRule(msg.ruleId)?.classes"
            >
              [{{ msg.line }}:{{ msg.column }}]: {{ msg.message }} (<a
                :href="getRule(msg.ruleId)?.url"
                target="_blank"
              >
                {{ msg.ruleId }} </a
              >)
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PgEditor from "./components/PgEditor.vue";
import RulesSettings from "./components/RulesSettings.vue";
import SnsBar from "./components/SnsBar.vue";
import { deserializeState, serializeState } from "./state";
import { DEFAULT_RULES_CONFIG, getRule } from "./rules";

const DEFAULT_CODE = `
TOML .X=                    "ESLINT"
KEY=                            1234
"QUO    TED".'K E Y S' ="STR    VAL"
[TBL            .A.B            .C ]
D.O.            TTE.            D=42
ARR=            [123            ,45,
67e8            ,90,            0.12
,0xF            ,0o7            ,42]
[[AR            .RA.            Y ]]
[[T.            ABL.            E ]]
B.O.            O.L=            true
H ={            A=1,            B=2}
Try . It                    =  "Now"

# -------------------------

# This is a TOML document

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00

[database]
enabled = true
ports = [ 8001, 8001, 8002 ]
data = [ ["delta", "phi"], [3.14] ]
temp_targets = { cpu = 79.5, case = 72.0 }

[servers]

[servers.alpha]
ip = "10.0.0.1"
role = "frontend"

[servers.beta]
ip = "10.0.0.2"
role = "backend"
`;

export default {
  name: "PlaygroundBlock",
  components: { PgEditor, RulesSettings, SnsBar },
  data() {
    return {
      code: DEFAULT_CODE,
      rules: Object.assign({}, DEFAULT_RULES_CONFIG),
      messages: [],
    };
  },
  computed: {
    serializedString() {
      const defaultCode = DEFAULT_CODE;
      const defaultRules = DEFAULT_RULES_CONFIG;
      const code = defaultCode === this.code ? undefined : this.code;
      const rules = equalsRules(defaultRules, this.rules)
        ? undefined
        : this.rules;
      const serializedString = serializeState({
        code,
        rules,
      });
      return serializedString;
    },
  },
  watch: {
    serializedString(serializedString) {
      if (
        typeof window !== "undefined" &&
        serializedString !== window.location.hash.slice(1) &&
        !this._initializing
      ) {
        window.location.replace(`#${serializedString}`);
      }
    },
  },
  mounted() {
    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", this.processUrlHashChange);
    }
    const serializedString =
      (typeof window !== "undefined" && window.location.hash.slice(1)) || "";
    if (serializedString) {
      this._initializing = true;
      this.rules = {};
      this.$nextTick().then(() => {
        this._initializing = false;
        this.processUrlHashChange();
      });
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("hashchange", this.processUrlHashChange);
    }
  },
  methods: {
    onChange({ messages }) {
      this.messages = messages;
    },
    getRule(ruleId) {
      return getRule(ruleId);
    },
    processUrlHashChange() {
      const serializedString =
        (typeof window !== "undefined" && window.location.hash.slice(1)) || "";
      if (serializedString !== this.serializedString) {
        const state = deserializeState(serializedString);
        this.code = state.code || DEFAULT_CODE;
        this.rules = state.rules || Object.assign({}, DEFAULT_RULES_CONFIG);
        return true;
      }
      return false;
    },
  },
};

function equalsRules(a, b) {
  const akeys = Object.keys(a).filter((k) => a[k] !== "off");
  const bkeys = Object.keys(b).filter((k) => b[k] !== "off");
  if (akeys.length !== bkeys.length) {
    return false;
  }

  for (const k of akeys) {
    if (a[k] !== b[k]) {
      return false;
    }
  }
  return true;
}
</script>
<style scoped>
.app {
  height: calc(100vh - 70px);
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 100px);
  border: 1px solid #cfd4db;
  background-color: #282c34;
  color: #fff;
}

.main-content > .rules-settings {
  height: 100%;
  overflow: auto;
  width: 30%;
  box-sizing: border-box;
}

.main-content > .editor-content {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #cfd4db;
}

.main-content > .editor-content > .eslint-playground {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 3px;
}

.main-content > .editor-content > .messages {
  height: 30%;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  border-top: 1px solid #cfd4db;
  padding: 8px;
  font-size: 12px;
}

.eslint-core-rule a {
  color: #8080f2;
}

.eslint-plugin-toml-rule a {
  color: #dd6b20;
}
</style>
