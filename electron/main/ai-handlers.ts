// electron/main/ai-handlers.ts
import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../src/shared/ipc-channels'
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk'

// 🔑 Pune aici API Key-ul tău de la Deepgram
const DEEPGRAM_API_KEY = '3496440ea2ff5be081b137bb826cc593b1364af2'

const deepgram = createClient(DEEPGRAM_API_KEY)
let dgConnection: any = null
let isListening = false

export function registerAiHandlers(mainWindow: BrowserWindow) {

    ipcMain.handle(IPC_CHANNELS.AI_START_LISTENING, async () => {
        try {
            console.log('[AI] Inițializare Deepgram Live...')

            // 1. Deschidem conexiunea live
            dgConnection = deepgram.listen.live({
                model: 'nova-2',
                language: 'ro',
                smart_format: true,
                interim_results: true,
                // Forțăm parametrii dacă auto-detecția eșuează pe VB-Cable
                encoding: 'linear16',
                sample_rate: 16000,
            });

            // Adăugăm un logger pentru evenimentul de 'Open' și 'Metadata'
            dgConnection.on(LiveTranscriptionEvents.Open, () => {
                console.log('[AI] ✅ CONEXIUNE STABILITĂ!');

                // Simulăm un titlu generat de AI după 3 secunde
                setTimeout(() => {
                    console.log('[AI] Trimit titlu de test către UI...');
                    mainWindow.webContents.send(IPC_CHANNELS.AI_SUGGESTED_TITLE, "TITLU TEST: REZULTATE ALEGERI");
                }, 3000);
            });

            dgConnection.on(LiveTranscriptionEvents.Metadata, (data: any) => {
                console.log('[AI] Deepgram Metadata:', data);
            });



            // 2. Eveniment: Am primit text transcris
            dgConnection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
                console.log('[AI] Raw Data de la Deepgram:', JSON.stringify(data.channel));
                const transcript = data.channel.alternatives[0].transcript
                if (transcript && data.is_final) {
                    console.log('[AI] Transcriere finală:', transcript)
                    // Trimitem textul către React pentru a-l afișa (opțional)
                    mainWindow.webContents.send(IPC_CHANNELS.AI_TRANSCRIPTION_TEXT, transcript)

                    // TODO: Aici vom acumula textul pentru a-l trimite la GPT-4 pentru titluri
                }
            })

            // 3. Eveniment: Eroare sau Închidere
            dgConnection.on(LiveTranscriptionEvents.Error, (err: any) => {
                console.error('[AI] Deepgram Error:', err)
                mainWindow.webContents.send(IPC_CHANNELS.AI_ERROR, err.message)
            })

            // IMPORTANT: Modificăm log-ul de închidere să ne dea detalii
            dgConnection.on(LiveTranscriptionEvents.Close, (event: any) => {
                console.log('[AI] ❌ Conexiune închisă. Cod:', event.code, 'Motiv:', event.reason);
            });

            isListening = true
            return { ok: true }
        } catch (error) {
            console.error('[AI] Failed to start:', error)
            return { ok: false, error: (error as Error).message }
        }
    })

    ipcMain.handle(IPC_CHANNELS.AI_STOP_LISTENING, async () => {
        isListening = false
        if (dgConnection) {
            dgConnection.finish()
            dgConnection = null
        }
        return { ok: true }
    })

    // 4. Primim sunetul de la React și îl trimitem la Deepgram
    ipcMain.on(IPC_CHANNELS.AI_AUDIO_CHUNK, (_event, chunk: Uint8Array) => {
        if (isListening && dgConnection && dgConnection.getReadyState() === 1) {
            dgConnection.send(Buffer.from(chunk))
        }
    })
}