import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const palette = {
  ink: "#0B1F3A",
  mint: "#00C389",
  amber: "#F6C445",
  sand: "#F2F4F8",
  soft: "#E8EEF6",
  alert: "#FF5A5A",
  white: "#FFFFFF",
};

const screens = {
  boasVindas: {
    title: "Boas-vindas",
    body:
      "Seguranca preditiva para quem voce ama. A rotina segura aprende o caminho e avisa antes do risco.",
    actions: ["Criar conta", "Entrar"],
  },
  rotina: {
    title: "Rotina segura inteligente",
    body: "Defina casa, escola e cursos. O app aprende horarios e rotas esperadas.",
    actions: ["Ativar rotina segura"],
  },
  monitoramento: {
    title: "Mapa e status",
    body:
      "Status: dentro do padrao. Ultimo check-in: Escola 12:05. Rota atual: casa -> escola.",
    actions: ["Ver detalhes"],
  },
  alerta: {
    title: "Alerta preventivo",
    body: "Desvio de rota detectado. Parada longa: 12 min.",
    actions: ["Confirmar seguro", "Abrir chat"],
  },
  sos: {
    title: "SOS com prova contextual",
    body:
      "Envia localizacao, audio de 15s, status da bateria e ultimos pontos do trajeto.",
    actions: ["Acionar SOS", "Cancelar com PIN"],
  },
  licoes: {
    title: "Micro-licoes diarias",
    body: "Licoes de 1 a 2 minutos com dicas praticas e progresso semanal.",
    actions: ["Play", "Ver progresso"],
  },
};

const parentCards = [
  { label: "Status", value: "Dentro do padrao" },
  { label: "Ultimo check-in", value: "Escola 12:05" },
  { label: "Alertas", value: "1 preventivo" },
];

const studentCards = [
  { label: "Rotina", value: "Ativa" },
  { label: "Bateria", value: "78%" },
  { label: "SOS", value: "Pronto" },
];

const ActionButton = ({ label, variant = "primary" }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === "ghost" ? styles.buttonGhost : styles.buttonPrimary,
    ]}
  >
    <Text
      style={
        variant === "ghost" ? styles.buttonGhostText : styles.buttonPrimaryText
      }
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const InfoCard = ({ label, value }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Section = ({ title, body, actions }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionBody}>{body}</Text>
    <View style={styles.actionRow}>
      {actions.map((label, index) => (
        <ActionButton
          key={`${title}-${label}`}
          label={label}
          variant={index === 0 ? "primary" : "ghost"}
        />
      ))}
    </View>
  </View>
);

export default function App() {
  const [mode, setMode] = useState("parent");

  const cards = useMemo(
    () => (mode === "parent" ? parentCards : studentCards),
    [mode]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Guardiao Digital</Text>
          <Text style={styles.heroTitle}>Seguranca preditiva em tempo real</Text>
          <Text style={styles.heroBody}>
            Um app unico para pais e alunos, com rotina segura, alertas
            preventivos e SOS contextual.
          </Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "parent" && styles.modeButtonActive,
              ]}
              onPress={() => setMode("parent")}
            >
              <Text
                style={
                  mode === "parent" ? styles.modeTextActive : styles.modeText
                }
              >
                Pais
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "student" && styles.modeButtonActive,
              ]}
              onPress={() => setMode("student")}
            >
              <Text
                style={
                  mode === "student" ? styles.modeTextActive : styles.modeText
                }
              >
                Aluno
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          {cards.map((card) => (
            <InfoCard key={card.label} label={card.label} value={card.value} />
          ))}
        </View>

        <Section
          title={screens.boasVindas.title}
          body={screens.boasVindas.body}
          actions={screens.boasVindas.actions}
        />
        <Section
          title={screens.rotina.title}
          body={screens.rotina.body}
          actions={screens.rotina.actions}
        />
        <Section
          title={screens.monitoramento.title}
          body={screens.monitoramento.body}
          actions={screens.monitoramento.actions}
        />
        <Section
          title={screens.alerta.title}
          body={screens.alerta.body}
          actions={screens.alerta.actions}
        />
        <Section
          title={screens.sos.title}
          body={screens.sos.body}
          actions={screens.sos.actions}
        />
        <Section
          title={screens.licoes.title}
          body={screens.licoes.body}
          actions={screens.licoes.actions}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Guardiao Digital - MVP inicial
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.sand,
  },
  container: {
    padding: 20,
    gap: 18,
  },
  hero: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.08)",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(11, 31, 58, 0.6)",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.ink,
  },
  heroBody: {
    fontSize: 14,
    color: "rgba(11, 31, 58, 0.7)",
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: palette.soft,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: palette.ink,
  },
  modeText: {
    fontWeight: "600",
    color: palette.ink,
  },
  modeTextActive: {
    fontWeight: "600",
    color: palette.white,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: palette.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.08)",
  },
  infoLabel: {
    fontSize: 12,
    color: "rgba(11, 31, 58, 0.6)",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.ink,
    marginTop: 6,
  },
  section: {
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.08)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.ink,
  },
  sectionBody: {
    fontSize: 14,
    color: "rgba(11, 31, 58, 0.7)",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  buttonPrimary: {
    backgroundColor: palette.ink,
  },
  buttonPrimaryText: {
    color: palette.white,
    fontWeight: "600",
  },
  buttonGhost: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.15)",
  },
  buttonGhostText: {
    color: palette.ink,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(11, 31, 58, 0.5)",
  },
});
