'use client';

import { useState } from 'react';
import { Tags, Copy, CheckCircle, Code, Eye, Download, AlertTriangle } from 'lucide-react';
import { StructuredDataType } from '@/types';
import { STRUCTURED_DATA_TEMPLATES } from '@/lib/structured-data';
import { generateJsonLd, validateJsonLd } from '@/lib/structured-data/engine';

export default function StructuredDataPage() {
  const [selectedType, setSelectedType] = useState<StructuredDataType>(StructuredDataType.SOFTWARE_APPLICATION);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const template = STRUCTURED_DATA_TEMPLATES[selectedType];

  const handleGenerate = () => {
    try {
      const jsonLd = generateJsonLd(selectedType, formData);
      setGeneratedCode(jsonLd);
      const result = validateJsonLd(jsonLd);
      setValidation(result);
      setActiveTab('preview');
    } catch (err: any) {
      setValidation({ valid: false, errors: [err.message] });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: 'html' | 'component' | 'script') => {
    let exportCode = generatedCode;
    if (format === 'html') {
      exportCode = `<!-- 添加到页面 <head> 中 -->\n<script type="application/ld+json">\n${generatedCode}\n</script>`;
    } else if (format === 'component') {
      exportCode = `// React/Next.js 组件\nimport Script from 'next/script';\n\nexport default function StructuredData() {\n  const jsonLd = ${generatedCode};\n  return (\n    <Script\n      id="structured-data"\n      type="application/ld+json"\n      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}\n    />\n  );\n}`;
    }

    const blob = new Blob([exportCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `structured-data.${format === 'html' ? 'html' : format === 'component' ? 'tsx' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">结构化标签引擎</h1>
        <p className="text-gray-500 mt-1">可视化生成标准 JSON-LD 结构化数据，让AI搜索引擎直接提取你的产品信息</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧：模板选择 + 表单 */}
        <div className="space-y-4">
          {/* 类型选择 */}
          <div className="card p-4">
            <label className="label">选择结构化数据类型</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STRUCTURED_DATA_TEMPLATES).map(([key, tpl]) => (
                <button
                  key={key}
                  onClick={() => { setSelectedType(key as StructuredDataType); setFormData({}); setGeneratedCode(''); setValidation(null); }}
                  className={`p-3 rounded-lg text-left text-sm transition-colors ${
                    selectedType === key
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className="font-medium">{tpl.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{tpl.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 表单 */}
          <div className="card p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Tags className="w-4 h-4 text-primary-600" />
              {template.name} - 参数配置
            </h3>
            <div className="space-y-3">
              {template.fields.map(field => (
                <div key={field.key}>
                  <label className="label">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      className="input-field"
                      value={formData[field.key] || ''}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    >
                      <option value="">请选择</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="input-field"
                      rows={3}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.description}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="input-field"
                      value={formData[field.key] || ''}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.description}
                    />
                  )}
                  {field.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleGenerate} className="btn-primary w-full mt-4">
              生成 JSON-LD
            </button>
          </div>
        </div>

        {/* 右侧：代码预览 */}
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Code className="w-4 h-4 text-primary-600" />
                生成代码
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('form')}
                  className={`text-xs px-3 py-1 rounded ${activeTab === 'form' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>
                  表单
                </button>
                <button onClick={() => setActiveTab('preview')}
                  className={`text-xs px-3 py-1 rounded ${activeTab === 'preview' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>
                  预览
                </button>
              </div>
            </div>

            {/* 校验结果 */}
            {validation && (
              <div className={`p-3 rounded-lg text-sm mb-3 ${
                validation.valid ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {validation.valid ? (
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> JSON-LD语法校验通过</div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4" /> 校验警告：</div>
                    {validation.errors.map((e, i) => <div key={i} className="text-xs ml-6">- {e}</div>)}
                  </div>
                )}
              </div>
            )}

            {/* 代码 */}
            {generatedCode ? (
              <>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-96">
                  <code>{generatedCode}</code>
                </pre>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleCopy} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '已复制' : '复制代码'}
                  </button>
                  <button onClick={() => handleExport('html')} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                    <Download className="w-3.5 h-3.5" /> HTML片段
                  </button>
                  <button onClick={() => handleExport('component')} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                    <Download className="w-3.5 h-3.5" /> React组件
                  </button>
                  <button onClick={() => handleExport('script')} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                    <Download className="w-3.5 h-3.5" /> 纯JSON
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Code className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>在左侧填写参数后点击生成</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
