import { describe, expect, it } from 'vitest';

import {
  formatIssuesBlock,
  updateBacklogContent,
  type Issue,
} from '../../tools/backlog_sync';

const makeIssue = (overrides: Partial<Issue> = {}): Issue => ({
  number: 1,
  title: 'Test issue',
  html_url: 'https://github.com/org/repo/issues/1',
  labels: [],
  state: 'open',
  assignees: [],
  created_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('backlog_sync', () => {
  describe('formatIssuesBlock', () => {
    it('formats empty issues list', () => {
      const block = formatIssuesBlock([]);
      expect(block).toContain('Live Issues Index');
      expect(block).toContain('No open issues');
      expect(block).toContain('<!-- AUTO:LIVE_ISSUES_START -->');
      expect(block).toContain('<!-- AUTO:LIVE_ISSUES_END -->');
    });

    it('formats issues with labels and assignees', () => {
      const issues = [
        makeIssue({
          number: 42,
          title: 'Fix bug',
          html_url: 'https://github.com/org/repo/issues/42',
          labels: [{ name: 'type:bug' }],
          assignees: [{ login: 'dev1' }],
        }),
      ];
      const block = formatIssuesBlock(issues);
      expect(block).toContain('#42');
      expect(block).toContain('Fix bug');
      expect(block).toContain('`type:bug`');
      expect(block).toContain('@dev1');
    });

    it('sorts by priority label', () => {
      const issues = [
        makeIssue({
          number: 1,
          title: 'Low priority',
          labels: [{ name: 'priority:low' }],
        }),
        makeIssue({
          number: 2,
          title: 'Critical',
          labels: [{ name: 'priority:critical' }],
        }),
      ];
      const block = formatIssuesBlock(issues);
      const criticalIdx = block.indexOf('#2');
      const lowIdx = block.indexOf('#1');
      expect(criticalIdx).toBeLessThan(lowIdx);
    });

    it('handles issues without assignees', () => {
      const block = formatIssuesBlock([makeIssue()]);
      expect(block).toContain('—');
    });
  });

  describe('updateBacklogContent', () => {
    it('appends auto-block when none exists', () => {
      const existing = '# Backlog\n\nManual content here.';
      const issuesBlock = '<!-- AUTO:LIVE_ISSUES_START -->\ntest\n<!-- AUTO:LIVE_ISSUES_END -->';
      const result = updateBacklogContent(existing, issuesBlock);
      expect(result).toContain('Manual content here.');
      expect(result).toContain('<!-- AUTO:LIVE_ISSUES_START -->');
    });

    it('replaces existing auto-block', () => {
      const existing = [
        '# Backlog',
        '',
        'Manual content.',
        '',
        '<!-- AUTO:LIVE_ISSUES_START -->',
        'old data',
        '<!-- AUTO:LIVE_ISSUES_END -->',
        '',
        'More manual content.',
      ].join('\n');
      const issuesBlock = '<!-- AUTO:LIVE_ISSUES_START -->\nnew data\n<!-- AUTO:LIVE_ISSUES_END -->';
      const result = updateBacklogContent(existing, issuesBlock);
      expect(result).toContain('new data');
      expect(result).not.toContain('old data');
      expect(result).toContain('Manual content.');
      expect(result).toContain('More manual content.');
    });

    it('preserves content before and after auto-block', () => {
      const existing =
        'BEFORE\n<!-- AUTO:LIVE_ISSUES_START -->\nold\n<!-- AUTO:LIVE_ISSUES_END -->\nAFTER';
      const result = updateBacklogContent(
        existing,
        '<!-- AUTO:LIVE_ISSUES_START -->\nnew\n<!-- AUTO:LIVE_ISSUES_END -->'
      );
      expect(result).toContain('BEFORE');
      expect(result).toContain('AFTER');
      expect(result).toContain('new');
    });
  });
});
