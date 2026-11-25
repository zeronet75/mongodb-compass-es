// CompassES.cpp — Interfaz grafica sencilla para aplicar o quitar la
// traduccion al espanol de MongoDB Compass.
//
// Compilar (MSVC):
//   cl /nologo /EHsc /O2 /DUNICODE /D_UNICODE CompassES.cpp /link /SUBSYSTEM:WINDOWS
//
// No usa frameworks externos: solo Win32.

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shlobj.h>
#include <shellapi.h>
#include <string>
#include <vector>
#include <cstdio>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "advapi32.lib")
#pragma comment(linker, "\"/manifestdependency:type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='*' publicKeyToken='6595b64144ccf1df' language='*'\"")

// ---------------------------------------------------------------------------
// Estado global
// ---------------------------------------------------------------------------
static HWND g_hwnd = nullptr;
static HWND g_hTitle = nullptr;
static HWND g_hSubtitle = nullptr;
static HWND g_hInstall = nullptr;
static HWND g_hRestore = nullptr;
static HWND g_hCloseCompass = nullptr;
static HWND g_hProjectLabel = nullptr;
static HWND g_hProjectPath = nullptr;
static HWND g_hChangeFolder = nullptr;
static HWND g_hLog = nullptr;
static HWND g_hStatus = nullptr;
static HWND g_hOpenCompass = nullptr;
static HWND g_hOpenFolder = nullptr;

static HFONT g_fontUI = nullptr;
static HFONT g_fontBold = nullptr;
static HFONT g_fontMono = nullptr;
static std::wstring g_projectDir;
static bool g_busy = false;

static const int IDC_INSTALL = 1001;
static const int IDC_RESTORE = 1002;
static const int IDC_OPEN_COMPASS = 1003;
static const int IDC_OPEN_FOLDER = 1004;
static const int IDC_CHANGE_FOLDER = 1005;
static const int IDC_CLOSE_COMPASS = 1006;
static const int IDC_LOG = 1010;
static const int IDC_STATUS = 1011;
static const int IDC_PROJECT = 1012;
#define IDI_APPICON 101

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
static std::wstring ExeDir()
{
    wchar_t path[MAX_PATH] = {};
    GetModuleFileNameW(nullptr, path, MAX_PATH);
    std::wstring s(path);
    size_t p = s.find_last_of(L"\\/");
    return (p == std::wstring::npos) ? L"." : s.substr(0, p);
}

static std::wstring Join(const std::wstring& a, const std::wstring& b)
{
    if (a.empty()) return b;
    if (a.back() == L'\\' || a.back() == L'/') return a + b;
    return a + L"\\" + b;
}

static bool FileExists(const std::wstring& path)
{
    DWORD attr = GetFileAttributesW(path.c_str());
    return attr != INVALID_FILE_ATTRIBUTES && !(attr & FILE_ATTRIBUTE_DIRECTORY);
}

static std::wstring CompassExePath()
{
    wchar_t buf[MAX_PATH] = {};
    DWORD n = GetEnvironmentVariableW(L"LOCALAPPDATA", buf, MAX_PATH);
    if (n == 0) return L"";
    return Join(std::wstring(buf), L"MongoDBCompass\\MongoDBCompass.exe");
}

static std::wstring ReadRegistryString(const wchar_t* name)
{
    HKEY key = nullptr;
    if (RegOpenKeyExW(HKEY_CURRENT_USER, L"Software\\CompassES", 0, KEY_READ, &key) != ERROR_SUCCESS)
        return L"";
    wchar_t buf[1024] = {};
    DWORD size = sizeof(buf) - sizeof(wchar_t);
    DWORD type = 0;
    std::wstring result;
    if (RegQueryValueExW(key, name, nullptr, &type, reinterpret_cast<LPBYTE>(buf), &size) == ERROR_SUCCESS && type == REG_SZ)
        result.assign(buf);
    RegCloseKey(key);
    return result;
}

static void WriteRegistryString(const wchar_t* name, const std::wstring& value)
{
    HKEY key = nullptr;
    if (RegCreateKeyExW(HKEY_CURRENT_USER, L"Software\\CompassES", 0, nullptr, 0, KEY_WRITE, nullptr, &key, nullptr) != ERROR_SUCCESS)
        return;
    RegSetValueExW(key, name, 0, REG_SZ, reinterpret_cast<const BYTE*>(value.c_str()),
                   static_cast<DWORD>((value.size() + 1) * sizeof(wchar_t)));
    RegCloseKey(key);
}

static void SetStatus(const std::wstring& text)
{
    SetWindowTextW(g_hStatus, text.c_str());
}

static std::wstring NormalizeNewlines(const std::wstring& s)
{
    std::wstring out;
    out.reserve(s.size() + 32);
    for (size_t i = 0; i < s.size(); ++i) {
        if (s[i] == L'\r') {
            out += L"\r\n";
            if (i + 1 < s.size() && s[i + 1] == L'\n') ++i;
        } else if (s[i] == L'\n') {
            out += L"\r\n";
        } else {
            out += s[i];
        }
    }
    return out;
}

static void AppendLog(const std::wstring& text)
{
    std::wstring normalized = NormalizeNewlines(text);
    int len = GetWindowTextLengthW(g_hLog);
    SendMessageW(g_hLog, EM_SETSEL, static_cast<WPARAM>(len), static_cast<LPARAM>(len));
    SendMessageW(g_hLog, EM_REPLACESEL, FALSE, reinterpret_cast<LPARAM>(normalized.c_str()));
}

static std::wstring Timestamp()
{
    SYSTEMTIME st;
    GetLocalTime(&st);
    wchar_t buf[64];
    swprintf_s(buf, L"%04d-%02d-%02d %02d:%02d:%02d", st.wYear, st.wMonth, st.wDay, st.wHour, st.wMinute, st.wSecond);
    return buf;
}

static std::wstring DecodeOutput(const std::vector<char>& data)
{
    if (data.empty()) return L"";
    int n = MultiByteToWideChar(CP_UTF8, MB_ERR_INVALID_CHARS, data.data(), static_cast<int>(data.size()), nullptr, 0);
    UINT cp = CP_UTF8;
    DWORD flags = MB_ERR_INVALID_CHARS;
    if (n <= 0) {
        cp = CP_OEMCP;
        flags = 0;
        n = MultiByteToWideChar(cp, flags, data.data(), static_cast<int>(data.size()), nullptr, 0);
    }
    if (n <= 0) return L"";
    std::wstring out(n, L'\0');
    MultiByteToWideChar(cp, flags, data.data(), static_cast<int>(data.size()), &out[0], n);
    return out;
}

static bool ReadFileBytes(const std::wstring& path, std::vector<char>& out)
{
    HANDLE h = CreateFileW(path.c_str(), GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE, nullptr,
                           OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr);
    if (h == INVALID_HANDLE_VALUE) return false;
    LARGE_INTEGER size{};
    if (!GetFileSizeEx(h, &size)) { CloseHandle(h); return false; }
    if (size.QuadPart > 0 && size.QuadPart < (64LL << 20)) {
        out.resize(static_cast<size_t>(size.QuadPart));
        DWORD read = 0;
        if (!ReadFile(h, out.data(), static_cast<DWORD>(out.size()), &read, nullptr)) out.clear();
        else out.resize(read);
    }
    CloseHandle(h);
    return true;
}

// Ejecuta un comando sin ventana de consola y devuelve su salida.
static bool RunHidden(const std::wstring& command, std::wstring& output, DWORD& exitCode)
{
    wchar_t tempDir[MAX_PATH] = {};
    GetTempPathW(MAX_PATH, tempDir);
    wchar_t tempFile[MAX_PATH] = {};
    GetTempFileNameW(tempDir, L"ces", 0, tempFile);

    SECURITY_ATTRIBUTES sa{};
    sa.nLength = sizeof(sa);
    sa.bInheritHandle = TRUE;

    HANDLE hOut = CreateFileW(tempFile, GENERIC_WRITE | GENERIC_READ,
                              FILE_SHARE_READ | FILE_SHARE_WRITE, &sa, CREATE_ALWAYS,
                              FILE_ATTRIBUTE_NORMAL, nullptr);
    HANDLE hNul = CreateFileW(L"NUL", GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE,
                              &sa, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr);
    if (hOut == INVALID_HANDLE_VALUE) {
        DeleteFileW(tempFile);
        return false;
    }

    STARTUPINFOW si{};
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESTDHANDLES;
    si.hStdOutput = hOut;
    si.hStdError = hOut;
    si.hStdInput = (hNul == INVALID_HANDLE_VALUE) ? nullptr : hNul;

    PROCESS_INFORMATION pi{};
    std::vector<wchar_t> cmd(command.begin(), command.end());
    cmd.push_back(0);

    BOOL ok = CreateProcessW(nullptr, cmd.data(), nullptr, nullptr, TRUE,
                             CREATE_NO_WINDOW | CREATE_UNICODE_ENVIRONMENT,
                             nullptr, nullptr, &si, &pi);

    CloseHandle(hOut);
    if (hNul != INVALID_HANDLE_VALUE) CloseHandle(hNul);

    if (!ok) {
        DeleteFileW(tempFile);
        return false;
    }

    WaitForSingleObject(pi.hProcess, INFINITE);
    exitCode = 1;
    GetExitCodeProcess(pi.hProcess, &exitCode);
    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);

    std::vector<char> bytes;
    ReadFileBytes(tempFile, bytes);
    output = DecodeOutput(bytes);
    DeleteFileW(tempFile);
    return true;
}

static void SetBusy(bool busy)
{
    g_busy = busy;
    EnableWindow(g_hInstall, !busy);
    EnableWindow(g_hRestore, !busy);
    EnableWindow(g_hChangeFolder, !busy);
    EnableWindow(g_hOpenCompass, !busy);
    EnableWindow(g_hOpenFolder, !busy);
    EnableWindow(g_hCloseCompass, !busy);
    SetCursor(LoadCursorW(nullptr, busy ? IDC_WAIT : IDC_ARROW));
}

static void UpdateProjectLabel()
{
    SetWindowTextW(g_hProjectPath, g_projectDir.c_str());
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------
static void RunScript(bool install)
{
    if (g_busy) return;

    const wchar_t* scriptName = install ? L"install-compass-es.ps1" : L"restore-compass-es.ps1";
    std::wstring script = Join(g_projectDir, scriptName);
    if (!FileExists(script)) {
        std::wstring msg = L"No se encuentra el script:\n\n" + script +
                           L"\n\nUsa «Cambiar…» para indicar la carpeta del proyecto.";
        MessageBoxW(g_hwnd, msg.c_str(), L"Archivo no encontrado", MB_ICONERROR | MB_OK);
        return;
    }
    if (!FileExists(Join(g_projectDir, L"install-compass-es.js"))) {
        MessageBoxW(g_hwnd,
                    L"La carpeta elegida no parece el proyecto de traducción:\n"
                    L"falta install-compass-es.js.",
                    L"Carpeta incorrecta", MB_ICONERROR | MB_OK);
        return;
    }

    bool closeCompass = SendMessageW(g_hCloseCompass, BM_GETCHECK, 0, 0) == BST_CHECKED;

    std::wstring command = L"powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"" + script + L"\"";
    if (closeCompass) command += L" -Force";

    AppendLog(L"\r\n=== " + std::wstring(install ? L"Instalar / actualizar" : L"Restaurar inglés") +
              L" — " + Timestamp() + L" ===\r\n");
    AppendLog(L"Comando: " + command + L"\r\n\r\n");
    SetBusy(true);
    SetStatus(install ? L"Instalando la traducción…" : L"Restaurando el original…");
    UpdateWindow(g_hwnd);

    std::wstring output;
    DWORD exitCode = 1;
    bool started = RunHidden(command, output, exitCode);

    AppendLog(output.empty() ? L"(sin salida)\r\n" : output + L"\r\n");
    AppendLog(L"Código de salida: " + std::to_wstring(exitCode) + L"\r\n");
    SetBusy(false);

    if (!started) {
        SetStatus(L"Error al ejecutar PowerShell");
        AppendLog(L"No se pudo ejecutar powershell.exe. Comprueba que Windows PowerShell está disponible.\r\n");
        MessageBeep(MB_ICONERROR);
        return;
    }

    if (exitCode == 0) {
        SetStatus(install ? L"Traducción instalada. Abre Compass para verla." : L"Original restaurado (inglés).");
        AppendLog(install
                      ? L"Listo. Puedes abrir Compass con el botón «Abrir Compass».\r\n"
                      : L"Listo. Compass volverá a abrirse en inglés.\r\n");
    } else {
        SetStatus(L"La operación ha fallado. Revisa el registro.");
        AppendLog(L"Error: revisa el registro. Causas habituales: falta Node.js o Compass está abierto.\r\n");
        MessageBeep(MB_ICONERROR);
    }
}

static void ChangeFolder()
{
    BROWSEINFOW bi{};
    bi.hwndOwner = g_hwnd;
    bi.lpszTitle = L"Selecciona la carpeta del proyecto (donde está install-compass-es.ps1)";
    bi.ulFlags = BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE | BIF_USENEWUI;
    LPITEMIDLIST pidl = SHBrowseForFolderW(&bi);
    if (!pidl) return;
    wchar_t path[MAX_PATH] = {};
    if (SHGetPathFromIDListW(pidl, path)) {
        g_projectDir = path;
        WriteRegistryString(L"ProjectDir", g_projectDir);
        UpdateProjectLabel();
        SetStatus(L"Carpeta del proyecto actualizada.");
    }
    CoTaskMemFree(pidl);
}

static void OpenCompass()
{
    std::wstring exe = CompassExePath();
    if (exe.empty() || !FileExists(exe)) {
        MessageBoxW(g_hwnd, L"No se encuentra MongoDBCompass.exe en %LOCALAPPDATA%\\MongoDBCompass.",
                    L"No encontrado", MB_ICONWARNING | MB_OK);
        return;
    }
    ShellExecuteW(nullptr, L"open", exe.c_str(), nullptr, nullptr, SW_SHOWNORMAL);
}

// ---------------------------------------------------------------------------
// Ventana
// ---------------------------------------------------------------------------
static HWND MakeControl(const wchar_t* cls, const wchar_t* text, DWORD style, DWORD exStyle,
                        int x, int y, int w, int h, int id, HFONT font)
{
    HWND hwndCtrl = CreateWindowExW(exStyle, cls, text, WS_CHILD | WS_VISIBLE | style,
                                    x, y, w, h, g_hwnd, reinterpret_cast<HMENU>(static_cast<INT_PTR>(id)),
                                    GetModuleHandleW(nullptr), nullptr);
    if (hwndCtrl && font) SendMessageW(hwndCtrl, WM_SETFONT, reinterpret_cast<WPARAM>(font), TRUE);
    return hwndCtrl;
}

static void CreateControls()
{
    NONCLIENTMETRICSW ncm{};
    ncm.cbSize = sizeof(ncm);
    SystemParametersInfoW(SPI_GETNONCLIENTMETRICS, sizeof(ncm), &ncm, 0);
    g_fontUI = CreateFontIndirectW(&ncm.lfMessageFont);
    g_fontBold = CreateFontW(-21, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                             OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                             DEFAULT_PITCH | FF_SWISS, L"Segoe UI");
    g_fontMono = CreateFontW(-13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                             OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                             FIXED_PITCH | FF_MODERN, L"Consolas");

    g_hTitle = MakeControl(L"STATIC", L"MongoDB Compass en español", SS_LEFT, 0,
                           20, 16, 500, 30, -1, g_fontBold);
    g_hSubtitle = MakeControl(L"STATIC",
                              L"Traduce la interfaz y los menús nativos. No modifica tus bases de datos.",
                              SS_LEFT, 0, 20, 48, 600, 20, -1, g_fontUI);

    g_hInstall = MakeControl(L"BUTTON", L"Instalar / actualizar", BS_PUSHBUTTON | WS_TABSTOP, 0,
                             20, 82, 190, 34, IDC_INSTALL, g_fontUI);
    g_hRestore = MakeControl(L"BUTTON", L"Restaurar inglés", BS_PUSHBUTTON | WS_TABSTOP, 0,
                             220, 82, 160, 34, IDC_RESTORE, g_fontUI);

    g_hCloseCompass = MakeControl(L"BUTTON", L"Cerrar Compass automáticamente si está abierto",
                                  BS_AUTOCHECKBOX | WS_TABSTOP, 0, 20, 126, 360, 22,
                                  IDC_CLOSE_COMPASS, g_fontUI);
    SendMessageW(g_hCloseCompass, BM_SETCHECK, BST_CHECKED, 0);

    g_hProjectLabel = MakeControl(L"STATIC", L"Proyecto:", SS_LEFT, 0, 20, 160, 60, 20, -1, g_fontUI);
    g_hProjectPath = MakeControl(L"STATIC", g_projectDir.c_str(), SS_LEFT | SS_PATHELLIPSIS, 0,
                                 84, 160, 450, 20, IDC_PROJECT, g_fontUI);
    g_hChangeFolder = MakeControl(L"BUTTON", L"Cambiar…", BS_PUSHBUTTON | WS_TABSTOP, 0,
                                  546, 155, 92, 26, IDC_CHANGE_FOLDER, g_fontUI);

    g_hLog = MakeControl(L"EDIT", L"", WS_VSCROLL | ES_MULTILINE | ES_READONLY | ES_AUTOVSCROLL,
                         WS_EX_CLIENTEDGE, 20, 192, 618, 288, IDC_LOG, g_fontMono);

    g_hStatus = MakeControl(L"STATIC", L"Listo.", SS_LEFT, 0, 20, 490, 500, 20, IDC_STATUS, g_fontUI);

    g_hOpenCompass = MakeControl(L"BUTTON", L"Abrir Compass", BS_PUSHBUTTON | WS_TABSTOP, 0,
                                 20, 518, 140, 30, IDC_OPEN_COMPASS, g_fontUI);
    g_hOpenFolder = MakeControl(L"BUTTON", L"Abrir carpeta", BS_PUSHBUTTON | WS_TABSTOP, 0,
                                170, 518, 140, 30, IDC_OPEN_FOLDER, g_fontUI);

    AppendLog(L"MongoDB Compass en español\r\n"
              L"1) Cierra Compass (o deja marcada la casilla de cierre automático).\r\n"
              L"2) Pulsa «Instalar / actualizar».\r\n"
              L"3) Para volver al inglés, «Restaurar inglés».\r\n");
}

static LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg) {
    case WM_CREATE:
        g_hwnd = hwnd;
        CreateControls();
        return 0;

    case WM_COMMAND: {
        int id = LOWORD(wParam);
        if (HIWORD(wParam) == BN_CLICKED) {
            switch (id) {
            case IDC_INSTALL: RunScript(true); return 0;
            case IDC_RESTORE: RunScript(false); return 0;
            case IDC_CHANGE_FOLDER: ChangeFolder(); return 0;
            case IDC_OPEN_COMPASS: OpenCompass(); return 0;
            case IDC_OPEN_FOLDER:
                ShellExecuteW(nullptr, L"open", g_projectDir.c_str(), nullptr, nullptr, SW_SHOWNORMAL);
                return 0;
            }
        }
        break;
    }

    case WM_SETICON:
        break;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE, PWSTR, int nCmdShow)
{
    SetProcessDPIAware();
    OleInitialize(nullptr);

    // Carpeta del proyecto: junto al .exe; si no hay scripts, la guardada.
    g_projectDir = ExeDir();
    if (!FileExists(Join(g_projectDir, L"install-compass-es.ps1"))) {
        std::wstring saved = ReadRegistryString(L"ProjectDir");
        if (!saved.empty() && FileExists(Join(saved, L"install-compass-es.ps1")))
            g_projectDir = saved;
    }

    WNDCLASSEXW wc{};
    wc.cbSize = sizeof(wc);
    wc.lpfnWndProc = WndProc;
    wc.hInstance = hInstance;
    wc.hCursor = LoadCursorW(nullptr, IDC_ARROW);
    wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_BTNFACE + 1);
    wc.lpszClassName = L"CompassESWindow";
    HICON appIconBig = reinterpret_cast<HICON>(LoadImageW(hInstance, MAKEINTRESOURCEW(IDI_APPICON), IMAGE_ICON,
                                                         GetSystemMetrics(SM_CXICON), GetSystemMetrics(SM_CYICON), 0));
    HICON appIconSmall = reinterpret_cast<HICON>(LoadImageW(hInstance, MAKEINTRESOURCEW(IDI_APPICON), IMAGE_ICON,
                                                           GetSystemMetrics(SM_CXSMICON), GetSystemMetrics(SM_CYSMICON), 0));
    wc.hIcon = appIconBig ? appIconBig : LoadIconW(nullptr, IDI_APPLICATION);
    wc.hIconSm = appIconSmall ? appIconSmall : wc.hIcon;
    RegisterClassExW(&wc);

    RECT rc{0, 0, 658, 560};
    AdjustWindowRect(&rc, WS_OVERLAPPEDWINDOW, FALSE);
    int w = rc.right - rc.left;
    int h = rc.bottom - rc.top;
    int x = (GetSystemMetrics(SM_CXSCREEN) - w) / 2;
    int y = (GetSystemMetrics(SM_CYSCREEN) - h) / 2;

    HWND hwnd = CreateWindowExW(0, wc.lpszClassName, L"MongoDB Compass en español",
                                WS_OVERLAPPEDWINDOW & ~WS_MAXIMIZEBOX, x, y, w, h,
                                nullptr, nullptr, hInstance, nullptr);
    if (!hwnd) return 1;

    // Icono propio (recurso 101) en la barra de titulo y en Alt+Tab.
    SendMessageW(hwnd, WM_SETICON, ICON_BIG, reinterpret_cast<LPARAM>(wc.hIcon));
    SendMessageW(hwnd, WM_SETICON, ICON_SMALL, reinterpret_cast<LPARAM>(wc.hIconSm));

    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);

    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0) > 0) {
        if (!IsDialogMessageW(hwnd, &msg)) {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }

    if (g_fontUI) DeleteObject(g_fontUI);
    if (g_fontBold) DeleteObject(g_fontBold);
    if (g_fontMono) DeleteObject(g_fontMono);
    OleUninitialize();
    return static_cast<int>(msg.wParam);
}
