import React, { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./src/firebase";

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

const authErrors = {
  "auth/invalid-email": "Email invalido.",
  "auth/user-not-found": "Usuario nao encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/email-already-in-use": "Esse email ja esta em uso.",
  "auth/weak-password": "Senha fraca. Use pelo menos 6 caracteres.",
};

const ActionButton = ({ label, variant = "primary", onPress, disabled }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === "ghost" ? styles.buttonGhost : styles.buttonPrimary,
      disabled && styles.buttonDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
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

const AuthScreen = ({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  loading,
  error,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={styles.authContainer}
  >
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>Guardiao Digital</Text>
      <Text style={styles.heroTitle}>Acesso rapido e seguro</Text>
      <Text style={styles.heroBody}>
        Entre para acompanhar a rotina ou crie uma conta para iniciar o
        monitoramento inteligente.
      </Text>
    </View>

    <View style={styles.authCard}>
      <View style={styles.authHeader}>
        <Text style={styles.sectionTitle}>
          {isLogin ? "Entrar" : "Criar conta"}
        </Text>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.linkText}>
            {isLogin ? "Novo por aqui?" : "Ja tenho conta"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.inputLabel}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <ActionButton
          label={isLogin ? "Entrar" : "Criar conta"}
          onPress={onSubmit}
          disabled={loading}
        />
        {loading ? (
          <ActivityIndicator color={palette.ink} style={styles.loading} />
        ) : null}
      </View>
    </View>
  </KeyboardAvoidingView>
);

export default function App() {
  const [mode, setMode] = useState("parent");
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  const cards = useMemo(
    () => (mode === "parent" ? parentCards : studentCards),
    [mode]
  );

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(authErrors[err.code] || "Falha de autenticacao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (initializing) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color={palette.ink} size="large" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <AuthScreen
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>Guardiao Digital</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.linkText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
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
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.sand,
  },
  container: {
    padding: 20,
    gap: 18,
  },
  topBar: {
    backgroundColor: palette.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.08)",
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.ink,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(11, 31, 58, 0.5)",
  },
  authContainer: {
    flex: 1,
    padding: 20,
    gap: 18,
  },
  authCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.08)",
    gap: 14,
  },
  authHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  form: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: "rgba(11, 31, 58, 0.6)",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(11, 31, 58, 0.12)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: palette.sand,
  },
  linkText: {
    color: palette.ink,
    fontWeight: "600",
  },
  errorText: {
    color: palette.alert,
    fontWeight: "600",
  },
  loading: {
    marginTop: 10,
  },
});
