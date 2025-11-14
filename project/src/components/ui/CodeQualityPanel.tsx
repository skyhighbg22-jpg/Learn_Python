import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Lightbulb, Code, Wrench, TrendingUp, Zap, Target } from 'lucide-react';
import { codeQualityService, CodeQualityReport, CodeQualityIssue } from '../../services/codeQualityService';

interface CodeQualityPanelProps {
  code: string;
  language?: string;
  lessonContext?: string;
  onAutoFix?: (code: string) => void;
  className?: string;
}

interface IssueCategoryProps {
  title: string;
  issues: CodeQualityIssue[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onFix?: (issue: CodeQualityIssue) => void;
}

const IssueCategory: React.FC<IssueCategoryProps> = ({
  title,
  issues,
  icon,
  color,
  bgColor,
  onFix
}) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  if (issues.length === 0) return null;

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  return (
    <div className={`rounded-lg border ${bgColor} ${color} p-4 mb-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          {icon}
          <span>{title}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
            {issues.length}
          </span>
        </h3>
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-slate-800 rounded-lg p-3 border border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <SeverityIndicator severity={issue.severity} />
                  <span className="text-white font-medium text-sm">{issue.message}</span>
                </div>

                <div className="text-slate-400 text-xs mb-2">
                  Line {issue.line_number}
                  {issue.column_number && `, Column ${issue.column_number}`}
                </div>

                {/* Expandable details */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleIssue(issue.id)}
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                  >
                    {expandedIssues.has(issue.id) ? 'Hide' : 'Show'} details
                    <span className={`inline-block transform transition-transform ${
                      expandedIssues.has(issue.id) ? 'rotate-90' : ''
                    }`}>▶</span>
                  </button>

                  {issue.fixable && onFix && (
                    <button
                      onClick={() => onFix(issue)}
                      className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1"
                    >
                      <Wrench size={12} />
                      Auto-fix
                    </button>
                  )}
                </div>

                {/* Expanded content */}
                {expandedIssues.has(issue.id) && (
                  <div className="mt-3 space-y-2">
                    {issue.suggestion && (
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-xs text-slate-300 mb-1">Suggestion:</div>
                        <div className="text-xs text-green-300">{issue.suggestion}</div>
                      </div>
                    )}

                    {issue.fixed_code && (
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-xs text-slate-300 mb-1">Fixed code:</div>
                        <code className="text-xs text-green-300 font-mono">{issue.fixed_code}</code>
                      </div>
                    )}

                    {issue.rule && (
                      <div className="text-xs text-slate-500">
                        Rule: {issue.rule}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SeverityIndicator: React.FC<{ severity: string }> = ({ severity }) => {
  switch (severity) {
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
    case 'style':
      return <Lightbulb className="w-4 h-4 text-purple-500" />;
    default:
      return <Info className="w-4 h-4 text-slate-500" />;
  }
};

const ScoreDisplay: React.FC<{ score: number; grade: string }> = ({ score, grade }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-400 bg-green-400/10';
      case 'B+':
      case 'B':
        return 'text-blue-400 bg-blue-400/10';
      case 'C+':
      case 'C':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'D':
        return 'text-orange-400 bg-orange-400/10';
      case 'F':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${getGradeColor(grade)}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{grade}</div>
          <div className="text-xs text-slate-400">Quality Score</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">{score}/100</div>
          <div className="text-xs text-slate-400">points</div>
        </div>
      </div>
    </div>
  );
};

export const CodeQualityPanel: React.FC<CodeQualityPanelProps> = ({
  code,
  language = 'python',
  lessonContext,
  onAutoFix,
  className = ''
}) => {
  const [report, setReport] = useState<CodeQualityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (code.trim()) {
      analyzeCode();
    } else {
      setReport(null);
    }
  }, [code, language, lessonContext]);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setAnalyzing(true);
    try {
      const qualityReport = await codeQualityService.analyzeCode(code, language, lessonContext);
      setReport(qualityReport);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setReport(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAutoFix = async (issue: CodeQualityIssue) => {
    if (!issue.fixable || !issue.fixed_code) return;

    try {
      const fixedCode = await codeQualityService.autoFixIssue(code, issue);
      if (fixedCode && onAutoFix) {
        onAutoFix(fixedCode);
        // Re-analyze after fix
        setTimeout(analyzeCode, 100);
      }
    } catch (error) {
      console.error('Error auto-fixing issue:', error);
    }
  };

  const handleAutoFixAll = async () => {
    if (!report) return;

    try {
      const fixedCode = await codeQualityService.autoFixAllIssues(code, report.issues);
      if (fixedCode && onAutoFix) {
        onAutoFix(fixedCode);
        // Re-analyze after fix
        setTimeout(analyzeCode, 100);
      }
    } catch (error) {
      console.error('Error auto-fixing all issues:', error);
    }
  };

  if (analyzing) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-slate-300">Analyzing code quality...</span>
        </div>
      </div>
    );
  }

  if (!report || report.issues.length === 0) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <div className="text-green-400 font-semibold mb-2">Excellent Code!</div>
          <div className="text-slate-400 text-sm">No quality issues detected</div>
        </div>
      </div>
    );
  }

  const errors = report.issues.filter(issue => issue.severity === 'error');
  const warnings = report.issues.filter(issue => issue.severity === 'warning');
  const styleIssues = report.issues.filter(issue => issue.severity === 'style' || issue.severity === 'info');

  return (
    <div className={`bg-slate-800 rounded-lg p-4 ${className}`}>
      {/* Header with Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Code Quality Analysis
          </h3>
          {report.fixable_issues > 0 && onAutoFix && (
            <button
              onClick={handleAutoFixAll}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
            >
              <Wrench size={12} />
              Fix All ({report.fixable_issues})
            </button>
          )}
        </div>

        <ScoreDisplay score={report.score} grade={report.grade} />
      </div>

      {/* Issue Categories */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <IssueCategory
          title="Errors"
          issues={errors}
          icon={<XCircle className="w-4 h-4 text-red-500" />}
          color="text-red-400"
          bgColor="border-red-500/30 bg-red-500/10"
          onFix={handleAutoFix}
        />

        <IssueCategory
          title="Warnings"
          issues={warnings}
          icon={<AlertTriangle className="w-4 h-4 text-yellow-500" />}
          color="text-yellow-400"
          bgColor="border-yellow-500/30 bg-yellow-500/10"
          onFix={handleAutoFix}
        />

        <IssueCategory
          title="Style Improvements"
          issues={styleIssues}
          icon={<Lightbulb className="w-4 h-4 text-purple-500" />}
          color="text-purple-400"
          bgColor="border-purple-500/30 bg-purple-500/10"
          onFix={handleAutoFix}
        />
      </div>

      {/* Quality Metrics */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Target className="w-3 h-3" />
            <span>{report.metrics.complexity} Complexity</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <TrendingUp className="w-3 h-3" />
            <span>{report.metrics.maintainability} Maintainability</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-3 h-3" />
            <span>{report.metrics.performance} Performance</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle className="w-3 h-3" />
            <span>{report.metrics.readability} Readability</span>
          </div>
        </div>
      </div>
    </div>
  );
};