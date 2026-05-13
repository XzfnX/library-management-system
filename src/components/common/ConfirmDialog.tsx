import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmDialog = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger'
}: ConfirmDialogProps) => {
  const styles = {
    danger: { icon: AlertTriangle, iconBg: 'bg-red-100', iconColor: 'text-red-600', btnBg: 'bg-red-600', btnHover: 'hover:bg-red-700' },
    warning: { icon: AlertTriangle, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', btnBg: 'bg-yellow-600', btnHover: 'hover:bg-yellow-700' },
    info: { icon: Info, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', btnBg: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
    success: { icon: CheckCircle, iconBg: 'bg-green-100', iconColor: 'text-green-600', btnBg: 'bg-green-600', btnHover: 'hover:bg-green-700' }
  };
  
  const style = styles[type];
  const Icon = style.icon;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 ${style.iconBg} rounded-full`}>
              <Icon size={28} className={style.iconColor} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {title}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 ${style.btnBg} text-white rounded-lg font-semibold ${style.btnHover} transition`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
