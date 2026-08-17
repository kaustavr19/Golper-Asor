import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { ChannelId } from "../catalogue";
import { supabase } from "../lib/supabase";

type PresenceStatus = "connecting" | "connected" | "unavailable";

interface VisitorPresence {
  visitorId?: string;
}

function countUniqueVisitors(realtimeChannel: RealtimeChannel) {
  const presences = Object.values(realtimeChannel.presenceState()).flat() as VisitorPresence[];
  const visitorIds = new Set(presences.map((presence) => presence.visitorId).filter(Boolean));
  return visitorIds.size || Object.keys(realtimeChannel.presenceState()).length;
}

function getListenerId() {
  const storageKey = "golper-asor-listener-id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;

  const id = window.crypto.randomUUID();
  window.localStorage.setItem(storageKey, id);
  return id;
}

export function useListenerPresence(channelId: ChannelId, episodeId?: string) {
  const [listenerCount, setListenerCount] = useState(0);
  const [status, setStatus] = useState<PresenceStatus>(supabase ? "connecting" : "unavailable");
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);
  const listenerIdRef = useRef<string | null>(null);
  const episodeIdRef = useRef(episodeId);
  episodeIdRef.current = episodeId;

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setStatus("unavailable");
      return;
    }

    listenerIdRef.current ??= getListenerId();
    subscribedRef.current = false;
    setStatus("connecting");
    setListenerCount(0);

    const realtimeChannel = client.channel(`listeners:${channelId}`, {
      config: { presence: { key: listenerIdRef.current } },
    });
    realtimeChannelRef.current = realtimeChannel;

    realtimeChannel
      .on("presence", { event: "sync" }, () => {
        setListenerCount(countUniqueVisitors(realtimeChannel));
      })
      .subscribe(async (subscriptionStatus) => {
        if (subscriptionStatus === "SUBSCRIBED") {
          subscribedRef.current = true;
          setStatus("connected");
          await realtimeChannel.track({
            visitorId: listenerIdRef.current,
            channel: channelId,
            episodeId: episodeIdRef.current ?? null,
            visitingSince: new Date().toISOString(),
          });
          return;
        }

        if (subscriptionStatus === "CHANNEL_ERROR" || subscriptionStatus === "TIMED_OUT") {
          subscribedRef.current = false;
          setStatus("unavailable");
        }
      });

    return () => {
      subscribedRef.current = false;
      realtimeChannelRef.current = null;
      void client.removeChannel(realtimeChannel);
    };
  }, [channelId]);

  useEffect(() => {
    const realtimeChannel = realtimeChannelRef.current;
    if (!realtimeChannel || !subscribedRef.current) return;

    void realtimeChannel.track({
      visitorId: listenerIdRef.current,
      channel: channelId,
      episodeId: episodeId ?? null,
      visitingSince: new Date().toISOString(),
    });
  }, [channelId, episodeId]);

  return { listenerCount, status };
}
