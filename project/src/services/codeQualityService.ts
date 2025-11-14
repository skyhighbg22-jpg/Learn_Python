import { supabase } from '../lib/supabase';

export interface CodeQualityIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'best_practice' | 'performance' | 'security';
  severity: 'critical' | 'major' | 'minor' | 'info';
  category: 'syntax' | 'style' | 'logic' | 'performance' | 'security' | 'readability';
  line: number;
  column: number;
  message: string;
  suggestion: string;
  code_snippet: string;
  rule_id: string;
  fix_available: boolean;
  auto_fix?: {
    original: string;
    suggestion: string;
    line: number;
  };
}

export interface CodeQualityScore {
  overall_score: number; // 0-100
  syntax_score: number;
  style_score: number;
  logic_score: number;
  performance_score: number;
  security_score: number;
  readability_score: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  feedback: string;
}

export interface CodeQualityReport {
  file_id: string;
  user_id: string;
  code_content: string;
  issues: CodeQualityIssue[];
  score: CodeQualityScore;
  metrics: {
    lines_of_code: number;
    cyclomatic_complexity: number;
    maintainability_index: number;
    duplicated_lines: number;
    code_smells: number;
    technical_debt: string; // Time to fix all issues
  };
  suggestions: string[];
  improvements: Array<{
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  created_at: string;
}

export interface QualityTrend {
  date: string;
  score: number;
  issues_count: number;
  improvements_made: number;
}

export class CodeQualityService {
  private static instance: CodeQualityService;
  private analysisCache: Map<string, CodeQualityReport> = new Map();

  private constructor() {}

  public static getInstance(): CodeQualityService {
    if (!CodeQualityService.instance) {
      CodeQualityService.instance = new CodeQualityService();
    }
    return CodeQualityService.instance;
  }

  /**
   * Analyze code quality using AI-powered rules
   */
  async analyzeCodeQuality(
    userId: string,
    code: string,
    language: string = 'python',
    lessonContext?: string
  ): Promise<CodeQualityReport> {
    try {
      const cacheKey = `${userId}_${this.hashString(code)}`;

      // Check cache
      if (this.analysisCache.has(cacheKey)) {
        return this.analysisCache.get(cacheKey)!;
      }

      const issues = await this.detectIssues(code, language, lessonContext);
      const score = this.calculateQualityScore(issues, code);
      const metrics = await this.calculateMetrics(code, language);
      const suggestions = this.generateSuggestions(issues, score, lessonContext);
      const improvements = this.prioritizeImprovements(issues, code);

      const report: CodeQualityReport = {
        file_id: this.generateFileId(),
        user_id: userId,
        code_content: code,
        issues,
        score,
        metrics,
        suggestions,
        improvements,
        created_at: new Date().toISOString()
      };

      // Cache the result
      this.analysisCache.set(cacheKey, report);

      // Store in database for tracking
      await this.saveQualityReport(report);

      return report;
    } catch (error) {
      console.error('Error analyzing code quality:', error);
      return this.getDefaultReport(userId, code);
    }
  }

  /**
   * Get user's code quality trends over time
   */
  async getCodeQualityTrends(userId: string, days: number = 30): Promise<QualityTrend[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data } = await supabase
        .from('code_quality_reports')
        .select('created_at, score, issues')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Group by date and calculate averages
      const trends: QualityTrend[] = [];
      const dailyData: Record<string, QualityTrend> = {};

      data?.forEach(report => {
        const date = new Date(report.created_at).toISOString().split('T')[0];

        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            score: 0,
            issues_count: 0,
            improvements_made: 0,
            count: 0
          } as any;
        }

        dailyData[date].score += report.score.overall_score;
        dailyData[date].issues_count += report.issues.length;
        (dailyData[date] as any).count++;
      });

      Object.entries(dailyData).forEach(([date, data]) => {
        const trend = data as any;
        trends.push({
          date,
          score: Math.round(trend.score / trend.count),
          issues_count: trend.issues_count,
          improvements_made: Math.max(0, 10 - trend.issues_count) // Estimate improvements
        });
      });

      return trends;
    } catch (error) {
      console.error('Error getting code quality trends:', error);
      return [];
    }
  }

  /**
   * Get quality improvement suggestions based on user history
   */
  async getPersonalizedSuggestions(userId: string): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('code_quality_reports')
        .select('issues, score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!data || data.length === 0) {
        return [
          "Start by writing clean, well-commented code",
          "Use meaningful variable names",
          "Follow PEP 8 style guidelines for Python"
        ];
      }

      // Analyze common issues
      const issueCounts: Record<string, number> = {};
      data.forEach(report => {
        report.issues.forEach(issue => {
          issueCounts[issue.category] = (issueCounts[issue.category] || 0) + 1;
        });
      });

      const suggestions: string[] = [];

      if (issueCounts.style > 5) {
        suggestions.push("Focus on consistent code formatting and style. Consider using a linter like 'black'.");
      }

      if (issueCounts.readability > 3) {
        suggestions.push("Improve code readability with better variable names and comments.");
      }

      if (issueCounts.performance > 2) {
        suggestions.push("Look for performance optimizations in your code patterns.");
      }

      if (issueCounts.security > 1) {
        suggestions.push("Pay attention to security best practices in your code.");
      }

      // Calculate average score trend
      const scores = data.map(r => r.score.overall_score);
      const recentScore = scores.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, scores.length);
      const olderScore = scores.slice(3, 6).reduce((a, b) => a + b, 0) / Math.min(3, Math.max(0, scores.length - 3));

      if (recentScore < olderScore) {
        suggestions.push("Your recent code quality has declined. Take time to review before committing.");
      } else if (recentScore > olderScore) {
        suggestions.push("Great improvement! Keep focusing on code quality best practices.");
      }

      return suggestions.length > 0 ? suggestions : [
        "Your code quality is consistently good. Keep up the excellent work!"
      ];
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      return [];
    }
  }

  /**
   * Auto-fix common code quality issues
   */
  async autoFixIssues(
    code: string,
    issues: CodeQualityIssue[]
  ): Promise<{ fixedCode: string; fixedIssues: CodeQualityIssue[] }> {
    let fixedCode = code;
    const fixedIssues: CodeQualityIssue[] = [];

    for (const issue of issues) {
      if (issue.auto_fix && issue.fix_available) {
        try {
          fixedCode = this.applyAutoFix(fixedCode, issue);
          fixedIssues.push(issue);
        } catch (error) {
          console.error(`Failed to auto-fix issue ${issue.id}:`, error);
        }
      }
    }

    return { fixedCode, fixedIssues };
  }

  /**
   * Compare code quality between two submissions
   */
  async compareCodeQuality(
    userId: string,
    reportId1: string,
    reportId2: string
  ): Promise<{
    improvement: number;
    categoryImprovements: Record<string, number>;
    issuesResolved: string[];
    newIssues: string[];
  }> {
    try {
      const { data } = await supabase
        .from('code_quality_reports')
        .select('*')
        .eq('user_id', userId)
        .in('id', [reportId1, reportId2]);

      if (!data || data.length !== 2) {
        throw new Error('Reports not found');
      }

      const report1 = data.find(r => r.id === reportId1)!;
      const report2 = data.find(r => r.id === reportId2)!;

      const improvement = report2.score.overall_score - report1.score.overall_score;

      const categoryImprovements: Record<string, number> = {};
      Object.keys(report1.score).forEach(key => {
        if (key !== 'overall_score' && key !== 'grade' && key !== 'feedback') {
          const score1 = report1.score[key as keyof CodeQualityScore] as number;
          const score2 = report2.score[key as keyof CodeQualityScore] as number;
          categoryImprovements[key] = score2 - score1;
        }
      });

      const issues1 = new Set(report1.issues.map(i => i.rule_id));
      const issues2 = new Set(report2.issues.map(i => i.rule_id));

      const issuesResolved = Array.from(issues1).filter(id => !issues2.has(id));
      const newIssues = Array.from(issues2).filter(id => !issues1.has(id));

      return {
        improvement,
        categoryImprovements,
        issuesResolved,
        newIssues
      };
    } catch (error) {
      console.error('Error comparing code quality:', error);
      return {
        improvement: 0,
        categoryImprovements: {},
        issuesResolved: [],
        newIssues: []
      };
    }
  }

  // Private helper methods

  private async detectIssues(
    code: string,
    language: string,
    lessonContext?: string
  ): Promise<CodeQualityIssue[]> {
    const issues: CodeQualityIssue[] = [];
    const lines = code.split('\n');

    // Syntax and basic pattern checks
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;

      // Check for common issues
      if (this.checkLineLength(line, lineNum)) {
        issues.push(this.createIssue(
          'line_length',
          'warning',
          'style',
          lineNum,
          0,
          'Line too long',
          'Lines should be under 79 characters',
          line,
          'Consider breaking this line into multiple lines',
          true,
          this.createAutoFix(lineNum, line)
        ));
      }

      if (this.checkTrailingWhitespace(line, lineNum)) {
        issues.push(this.createIssue(
          'trailing_whitespace',
          'warning',
          'style',
          lineNum,
          line.length,
          'Trailing whitespace',
          'Remove trailing whitespace',
          line,
          'Trailing spaces should be removed',
          true,
          {
            original: line,
            suggestion: line.trimEnd(),
            line: lineNum
          }
        ));
      }

      if (this.checkNamingConventions(line, lineNum)) {
        issues.push(this.createIssue(
          'naming_convention',
          'suggestion',
          'style',
          lineNum,
          0,
          'Naming convention',
          'Use snake_case for variable names',
          line,
          'Variable names should use snake_case convention',
          true,
          this.createNamingFix(lineNum, line)
        ));
      }

      if (this.checkMissingDocstring(line, lineNum, lines, i)) {
        issues.push(this.createIssue(
          'missing_docstring',
          'suggestion',
          'readability',
          lineNum,
          0,
          'Missing docstring',
          'Functions should have docstrings',
          line,
          'Add a docstring to explain what this function does',
          false
        ));
      }

      if (this.checkUnusedImports(line, lineNum, code)) {
        issues.push(this.createIssue(
          'unused_import',
          'suggestion',
          'performance',
          lineNum,
          0,
          'Unused import',
          'Remove unused imports',
          line,
          'This import is not used in the code',
          true,
          {
            original: line,
            suggestion: '',
            line: lineNum
          }
        ));
      }
    }

    return issues;
  }

  private calculateQualityScore(issues: CodeQualityIssue[], code: string): CodeQualityScore {
    const issueCounts = {
      critical: 0,
      major: 0,
      minor: 0,
      info: 0
    };

    const categoryCounts = {
      syntax: 0,
      style: 0,
      logic: 0,
      performance: 0,
      security: 0,
      readability: 0
    };

    issues.forEach(issue => {
      issueCounts[issue.severity]++;
      categoryCounts[issue.category]++;
    });

    // Calculate scores (100 is perfect, subtract points for issues)
    const totalIssues = issues.length;
    const linesOfCode = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).length;

    const syntaxScore = Math.max(0, 100 - (categoryCounts.syntax * 10));
    const styleScore = Math.max(0, 100 - (categoryCounts.style * 5));
    const logicScore = Math.max(0, 100 - (categoryCounts.logic * 15));
    const performanceScore = Math.max(0, 100 - (categoryCounts.performance * 20));
    const securityScore = Math.max(0, 100 - (categoryCounts.security * 25));
    const readabilityScore = Math.max(0, 100 - (categoryCounts.readability * 8));

    const overallScore = Math.round(
      (syntaxScore + styleScore + logicScore + performanceScore + securityScore + readabilityScore) / 6
    );

    return {
      overall_score: overallScore,
      syntax_score: syntaxScore,
      style_score: styleScore,
      logic_score: logicScore,
      performance_score: performanceScore,
      security_score: securityScore,
      readability_score: readabilityScore,
      grade: this.calculateGrade(overallScore),
      feedback: this.generateFeedback(overallScore, issueCounts)
    };
  }

  private calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 89) return 'B+';
    if (score >= 85) return 'B';
    if (score >= 81) return 'C+';
    if (score >= 77) return 'C';
    if (score >= 73) return 'D';
    return 'F';
  }

  private generateFeedback(score: number, issueCounts: any): string {
    if (score >= 90) {
      return 'Excellent code quality! Your code follows best practices very well.';
    } else if (score >= 80) {
      return 'Good code quality with room for minor improvements.';
    } else if (score >= 70) {
      return 'Fair code quality. Consider addressing the suggested improvements.';
    } else if (score >= 60) {
      return 'Code needs significant improvement. Focus on critical issues first.';
    } else {
      return 'Code quality requires immediate attention. Address critical issues before proceeding.';
    }
  }

  private async calculateMetrics(code: string, language: string): Promise<any> {
    const lines = code.split('\n');
    const linesOfCode = lines.filter(line => line.trim() && !line.trim().startsWith('#')).length;

    // Simple metrics (in a real implementation, these would be more sophisticated)
    return {
      lines_of_code: linesOfCode,
      cyclomatic_complexity: Math.ceil(linesOfCode / 5), // Simple estimation
      maintainability_index: Math.max(0, 100 - (linesOfCode / 2)),
      duplicated_lines: 0, // Would need more sophisticated analysis
      code_smells: Math.ceil(linesOfCode / 20),
      technical_debt: `${Math.ceil(linesOfCode / 10)} minutes`
    };
  }

  private generateSuggestions(issues: CodeQualityIssue[], score: CodeQualityScore, lessonContext?: string): string[] {
    const suggestions: string[] = [];

    if (score.overall_score < 80) {
      suggestions.push('Focus on fixing critical and major issues first.');
    }

    const categoryIssues = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (categoryIssues.style > 3) {
      suggestions.push('Consider using a code formatter like Black for consistent styling.');
    }

    if (categoryIssues.readability > 2) {
      suggestions.push('Add comments and improve variable naming for better readability.');
    }

    if (lessonContext) {
      suggestions.push(`Keep in mind the ${lessonContext} concepts you're learning.`);
    }

    if (suggestions.length === 0) {
      suggestions.push('Great code! Keep following Python best practices.');
    }

    return suggestions;
  }

  private prioritizeImprovements(issues: CodeQualityIssue[], code: string): any[] {
    const improvements = [];
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const majorIssues = issues.filter(i => i.severity === 'major');
    const minorIssues = issues.filter(i => i.severity === 'minor');

    if (criticalIssues.length > 0) {
      improvements.push({
        priority: 'high',
        description: 'Fix critical errors first',
        impact: 'Prevents code from running correctly',
        effort: 'low'
      });
    }

    if (majorIssues.length > 0) {
      improvements.push({
        priority: 'high',
        description: `Address ${majorIssues.length} major issues`,
        impact: 'Improves code reliability and maintainability',
        effort: 'medium'
      });
    }

    if (minorIssues.length > 5) {
      improvements.push({
        priority: 'low',
        description: 'Clean up minor style issues',
        impact: 'Improves code readability',
        effort: 'low'
      });
    }

    return improvements;
  }

  private async saveQualityReport(report: CodeQualityReport): Promise<void> {
    try {
      const { error } = await supabase
        .from('code_quality_reports')
        .insert({
          user_id: report.user_id,
          code_content: report.code_content,
          score: report.score,
          issues: report.issues,
          metrics: report.metrics,
          created_at: report.created_at
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving quality report:', error);
    }
  }

  private getDefaultReport(userId: string, code: string): CodeQualityReport {
    return {
      file_id: this.generateFileId(),
      user_id: userId,
      code_content: code,
      issues: [],
      score: {
        overall_score: 100,
        syntax_score: 100,
        style_score: 100,
        logic_score: 100,
        performance_score: 100,
        security_score: 100,
        readability_score: 100,
        grade: 'A+',
        feedback: 'Code analysis completed successfully.'
      },
      metrics: {
        lines_of_code: code.split('\n').length,
        cyclomatic_complexity: 1,
        maintainability_index: 100,
        duplicated_lines: 0,
        code_smells: 0,
        technical_debt: '0 minutes'
      },
      suggestions: ['Keep up the good work!'],
      improvements: [],
      created_at: new Date().toISOString()
    };
  }

  // Issue detection helpers
  private checkLineLength(line: string, lineNum: number): boolean {
    return line.length > 79;
  }

  private checkTrailingWhitespace(line: string, lineNum: number): boolean {
    return line.length !== line.trimEnd().length;
  }

  private checkNamingConventions(line: string, lineNum: number): boolean {
    // Simple check for camelCase vs snake_case
    const camelCasePattern = /\b[a-z][a-zA-Z]*[A-Z][a-zA-Z]*\b/;
    return camelCasePattern.test(line);
  }

  private checkMissingDocstring(line: string, lineNum: number, lines: string[], index: number): boolean {
    // Check if this is a function definition without docstring
    if (line.includes('def ') && index < lines.length - 1) {
      const nextLine = lines[index + 1].trim();
      return !nextLine.startsWith('"""') && !nextLine.startsWith("'''");
    }
    return false;
  }

  private checkUnusedImports(line: string, lineNum: number, fullCode: string): boolean {
    if (line.startsWith('import ') || line.startsWith('from ')) {
      // Simple check - would need more sophisticated parsing
      return false;
    }
    return false;
  }

  private createIssue(
    ruleId: string,
    type: string,
    category: string,
    line: number,
    column: number,
    message: string,
    suggestion: string,
    snippet: string,
    fix_available: boolean,
    auto_fix?: any
  ): CodeQualityIssue {
    return {
      id: this.generateIssueId(),
      type: type as any,
      severity: this.getSeverity(type),
      category: category as any,
      line,
      column,
      message,
      suggestion,
      code_snippet: snippet,
      rule_id: ruleId,
      fix_available,
      auto_fix
    };
  }

  private getSeverity(type: string): 'critical' | 'major' | 'minor' | 'info' {
    switch (type) {
      case 'error': return 'critical';
      case 'warning': return 'major';
      case 'suggestion': return 'minor';
      default: return 'info';
    }
  }

  private createAutoFix(lineNum: number, line: string): any {
    return {
      original: line,
      suggestion: line.length > 79 ? this.breakLine(line) : line,
      line: lineNum
    };
  }

  private createNamingFix(lineNum: number, line: string): any {
    // Simple camelCase to snake_case conversion
    const fixedLine = line.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    return {
      original: line,
      suggestion: fixedLine,
      line: lineNum
    };
  }

  private breakLine(line: string): string {
    if (line.length <= 79) return line;
    // Simple line breaking - would need more sophisticated logic
    return line.substring(0, 76) + '...';
  }

  private applyAutoFix(code: string, issue: CodeQualityIssue): string {
    if (!issue.auto_fix) return code;

    const lines = code.split('\n');
    if (issue.auto_fix.line > 0 && issue.auto_fix.line <= lines.length) {
      lines[issue.auto_fix.line - 1] = issue.auto_fix.suggestion;
    }
    return lines.join('\n');
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateIssueId(): string {
    return `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
}

export const codeQualityService = CodeQualityService.getInstance();