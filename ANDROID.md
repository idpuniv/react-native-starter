# ADB - Guide de développement Android / React Native

## Qu'est-ce qu'ADB ?

**ADB (Android Debug Bridge)** est un outil permettant à un ordinateur de communiquer avec un appareil Android.

Il repose sur une architecture **client / serveur**.

```text
             USB ou TCP/IP
+----------------+                    +-------------------------+
|    adb (PC)    | <--------------->  | adbd (Téléphone Android)|
+----------------+                    +-------------------------+
```

* **adb** : client exécuté sur le PC.
* **adbd** : serveur (daemon) exécuté sur Android.

---

# Connexion USB

Lister les appareils connectés :

```bash
adb devices
```

Afficher les informations détaillées :

```bash
adb devices -l
```

Ouvrir un terminal sur Android :

```bash
adb shell
```

---

# Utilisation d'ADB en Wi-Fi

Par défaut, ADB communique via USB.

Pour activer le mode TCP/IP :

```bash
adb tcpip 5555
```

Cette commande demande au daemon **adbd** d'écouter sur le port TCP **5555**.

```text
Avant

PC
 |
USB
 |
Téléphone
 |
adbd

Après

Téléphone
192.168.1.20:5555
        |
      adbd
```

Connexion au téléphone :

```bash
adb connect 192.168.1.20:5555
```

Le PC devient alors un client TCP qui communique avec le serveur ADB du téléphone.

Vérification :

```bash
adb devices
```

Résultat attendu :

```text
List of devices attached

192.168.1.20:5555    device
```

Le mot **device** indique que la connexion est opérationnelle.

---

# Comprendre `0.0.0.0`

`0.0.0.0` ne signifie **pas** "tous les ports".

Il signifie :

> Écouter sur **toutes les interfaces réseau**.

Exemple :

```text
127.0.0.1:8080
```

Accessible uniquement depuis la machine locale.

```text
0.0.0.0:8080
```

Accessible depuis toutes les interfaces réseau de la machine (selon le pare-feu).

---

# adb reverse

Syntaxe :

```bash
adb reverse tcp:PORT_TELEPHONE tcp:PORT_PC
```

Cette commande redirige un port **du téléphone** vers **le PC**.

```text
Téléphone
localhost:PORT_TELEPHONE
        |
        |
        v
PC
localhost:PORT_PC
```

## Exemple React Native

Metro Bundler écoute sur le PC :

```text
PC

Metro Bundler
localhost:8081
```

L'application Android tente d'accéder à :

```text
http://localhost:8081
```

Or, sur Android :

```text
localhost
```

désigne **le téléphone**, pas le PC.

La commande :

```bash
adb reverse tcp:8081 tcp:8081
```

crée automatiquement cette redirection :

```text
Téléphone
localhost:8081
        |
        |
        v
PC
localhost:8081
```

L'application récupère alors correctement le bundle JavaScript.

### Vérifier les redirections

Lister les redirections :

```bash
adb reverse --list
```

Supprimer une redirection :

```bash
adb reverse --remove tcp:8081
```

Supprimer toutes les redirections :

```bash
adb reverse --remove-all
```

> **Remarque**
>
> Les versions récentes de React Native exécutent généralement `adb reverse` automatiquement lors de `npx react-native run-android`.

---

# adb forward

Syntaxe :

```bash
adb forward tcp:PORT_PC tcp:PORT_TELEPHONE
```

Cette commande redirige un port **du PC** vers **le téléphone**.

```text
PC
localhost:PORT_PC
        |
        |
        v
Téléphone
localhost:PORT_TELEPHONE
```

Utilisé lorsqu'une application Android expose un serveur HTTP, WebSocket ou un autre service auquel le PC doit accéder.

---

# Résumé

| Commande              | Description                        |
| --------------------- | ---------------------------------- |
| `adb tcpip 5555`      | Active ADB en TCP sur le téléphone |
| `adb connect IP:5555` | Connexion du PC au téléphone       |
| `adb reverse`         | Téléphone → PC                     |
| `adb forward`         | PC → Téléphone                     |

---

# Workflow React Native en Wi-Fi

Connexion au téléphone :

```bash
adb connect 192.168.1.20:5555
```

Vérification :

```bash
adb devices
```

Résultat :

```text
List of devices attached
192.168.1.20:5555    device
```

Lancer Metro :

```bash
npx react-native start
```

Lancer l'application :

```bash
npx react-native run-android
```

Si plusieurs appareils sont connectés :

```bash
npx react-native run-android --device 192.168.1.20:5555
```

> **Important**
>
> `--device` n'est nécessaire que lorsque plusieurs appareils ou émulateurs sont détectés par ADB. Si un seul appareil est connecté, React Native le sélectionne automatiquement.

---

# Les logs Android

Toutes les applications Android écrivent leurs événements dans le système de logs.

Architecture :

```text
Application Android
        |
        | écrit des événements
        |
        v
     logd
        |
        v
   adb logcat
        |
        v
      Ton PC
```

---

# Afficher tous les logs

```bash
adb logcat
```

---

# Nettoyer les logs

```bash
adb logcat -c
```

---

# Sauvegarder les logs

```bash
adb logcat -d > logs.txt
```

---

# Niveaux de gravité

| Lettre | Niveau      |
| ------ | ----------- |
| V      | Verbose     |
| D      | Debug       |
| I      | Information |
| W      | Warning     |
| E      | Error       |
| F      | Fatal       |
| S      | Silent      |

---

# Filtrer les logs

Afficher uniquement les erreurs de tous les tags :

```bash
adb logcat *:E
```

Afficher uniquement les erreurs du tag `ActivityManager` :

```bash
adb logcat ActivityManager:E
```

Afficher les erreurs JavaScript React Native :

```bash
adb logcat ReactNativeJS:E *:S
```

Afficher les crashs Android :

```bash
adb logcat AndroidRuntime:E *:S
```

Afficher les principaux logs React Native :

```bash
adb logcat ReactNativeJS:V ReactNative:V AndroidRuntime:E *:S
```

---

# Tags utiles en React Native

| Tag             | Utilisation                    |
| --------------- | ------------------------------ |
| ReactNativeJS   | Erreurs JavaScript             |
| ReactNative     | Logs du framework React Native |
| AndroidRuntime  | Crashs Android                 |
| ActivityManager | Gestion des activités Android  |
| System.err      | Exceptions Java                |
| OkHttp          | Requêtes HTTP                  |
| SQLite          | Base de données SQLite         |
| WebView         | Débogage WebView               |
| Camera          | Caméra                         |
| Bluetooth       | Bluetooth                      |

---

# Workflow de débogage React Native

```bash
# Nettoyer les anciens logs
adb logcat -c

# Démarrer Metro
npx react-native start

# Installer et lancer l'application
npx react-native run-android

# Surveiller les logs importants
adb logcat ReactNativeJS:V ReactNative:V AndroidRuntime:E *:S


# Réinitialiser une connexion ADB

Lorsqu'ADB ne détecte plus correctement un appareil ou qu'il reste bloqué sur un ancien identifiant (USB ou Wi-Fi), il est souvent nécessaire de réinitialiser la connexion.

## Voir les appareils connectés

```bash
adb devices
```

---

## Déconnecter tous les appareils TCP/IP

```bash
adb disconnect
```

Déconnecter un appareil spécifique :

```bash
adb disconnect 192.168.1.20:5555
```

---

## Redémarrer le serveur ADB

Arrêter le serveur :

```bash
adb kill-server
```

Le redémarrer :

```bash
adb start-server
```

Ou simplement :

```bash
adb devices
```

Le serveur sera relancé automatiquement s'il n'est pas démarré.

---

## Reconnecter un appareil Wi-Fi

```bash
adb connect 192.168.1.20:5555
```

---

## Vérifier la connexion

```bash
adb devices -l
```

Exemple :

```text
List of devices attached

192.168.1.20:5555    device
```

---

## Réinitialiser les redirections de ports

Supprimer une redirection :

```bash
adb reverse --remove tcp:8081
```

Supprimer toutes les redirections :

```bash
adb reverse --remove-all
```

Lister les redirections :

```bash
adb reverse --list
```

---

## Cas fréquent en React Native

### Symptôme

```text
adb: device 'RFCT511PHFX' not found
```

Cela signifie généralement que React Native tente encore d'utiliser un ancien périphérique (USB) alors que le téléphone est désormais connecté en Wi-Fi.

### Solution

```bash
adb disconnect
adb kill-server
adb start-server
adb connect 192.168.1.20:5555
adb devices
```

Puis relancer :

```bash
npx react-native run-android
```

Si plusieurs appareils sont connectés :

```bash
npx react-native run-android --device 192.168.1.20:5555
```



