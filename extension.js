// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Создаем новый провайдер цветов
    const colorProvider = new EvenOddColorProvider();

    // Регистрируем провайдер цветов для всех типов файлов
    const disposable = vscode.languages.registerColorProvider('*', colorProvider);

    context.subscriptions.push(disposable);
}

class EvenOddColorProvider {
    provideDocumentColors(document) {
        const colors = [];

        // Регулярное выражение для поиска чисел в тексте
        const regex = /\b\d+\b/g;

        let match;
        while ((match = regex.exec(document.getText()))) {
            const number = parseInt(match[0]);

            // Проверяем, является ли число четным или нечетным
            const color = number % 2 === 0 ? new vscode.Color(255, 0, 0, 1) : new vscode.Color(0, 0, 255, 1);

            // Создаем диапазон для выделения цветом
            const range = new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length)
            );

            // Добавляем цвет и диапазон в список
            colors.push(new vscode.ColorInformation(range, color));
        }

        return colors;
    }

    provideColorPresentations(color, context, token) {
        // Возвращаем простое описание цвета для отображения в палитре
        return [
            {
                label: colorToLabel(color),
                textEdit: undefined,
                additionalTextEdits: undefined,
            },
        ];
    }
}

function colorToLabel(color) {
    // Преобразуем цвет в формат RGB
    const red = Math.round(color.red * 255);
    const green = Math.round(color.green * 255);
    const blue = Math.round(color.blue * 255);
    return `RGB(${red}, ${green}, ${blue})`;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
